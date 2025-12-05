import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { v4 as uuidv4 } from "uuid"

interface ProjectViewPageProps {
  params: Promise<{ username: string; project: string }>
}

export async function generateMetadata({ params }: ProjectViewPageProps): Promise<Metadata> {
  const { username, project: projectSlug } = await params
  const supabase = await getSupabaseServerClient()

  const { data: profile } = await supabase.from("profiles").select("id").eq("username", username).single()

  if (!profile) {
    return { title: "Project Not Found" }
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", projectSlug)
    .single()

  if (!project) {
    return { title: "Project Not Found" }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://muxday.app"

  return {
    title: project.title,
    description: project.description || `A project by @${username} on MuxDay`,
    openGraph: {
      title: project.title,
      description: project.description || `A project by @${username} on MuxDay`,
      type: "website",
      url: `${siteUrl}/${username}/${projectSlug}`,
      images: project.thumbnail_url ? [project.thumbnail_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description || `A project by @${username} on MuxDay`,
    },
  }
}

export default async function ProjectViewPage({ params }: ProjectViewPageProps) {
  const { username, project: projectSlug } = await params
  const supabase = await getSupabaseServerClient()
  const headersList = await headers()

  const { data: profile } = await supabase.from("profiles").select("id, username").eq("username", username).single()

  if (!profile) {
    notFound()
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", profile.id)
    .eq("slug", projectSlug)
    .single()

  if (!project || !project.is_public) {
    notFound()
  }

  // Track analytics (server-side)
  const userAgent = headersList.get("user-agent") || ""
  const referrer = headersList.get("referer") || ""
  const forwardedFor = headersList.get("x-forwarded-for")
  const ipHash = forwardedFor ? Buffer.from(forwardedFor.split(",")[0]).toString("base64").slice(0, 16) : "anonymous"

  await supabase.from("project_analytics").insert({
    project_id: project.id,
    visitor_id: uuidv4(),
    ip_hash: ipHash,
    user_agent: userAgent.slice(0, 500),
    referrer: referrer.slice(0, 500),
  })

  // Generate full HTML document
  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${project.description || ""}">
  <meta property="og:title" content="${project.title}">
  <meta property="og:description" content="${project.description || ""}">
  <meta name="twitter:card" content="summary">
  <title>${project.title}</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
    ${project.css_code}
  </style>
</head>
<body>
  ${project.html_code}
  <script>
    (function() {
      'use strict';
      try {
        ${project.js_code}
      } catch (e) {
        console.error('Script Error:', e.message);
      }
    })();
  </script>
</body>
</html>`

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: 0, height: "100vh" }}>
        <iframe
          srcDoc={fullHtml}
          sandbox="allow-scripts allow-modals allow-forms"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          title={project.title}
        />
      </body>
    </html>
  )
}
