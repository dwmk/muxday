import { getSupabaseServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProjectCard } from "@/components/project/project-card"
import type { Metadata } from "next"

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params
  const supabase = await getSupabaseServerClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (!profile) {
    return { title: "User Not Found" }
  }

  return {
    title: profile.display_name || profile.username,
    description: profile.bio || `Check out ${profile.username}'s projects on MuxDay`,
    openGraph: {
      title: profile.display_name || profile.username,
      description: profile.bio || `Check out ${profile.username}'s projects on MuxDay`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
    twitter: {
      card: "summary",
      title: profile.display_name || profile.username,
      description: profile.bio || `Check out ${profile.username}'s projects on MuxDay`,
    },
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: viewerProfile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).single()
    : { data: null }

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single()

  if (!profile) {
    notFound()
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  const { data: stats } = await supabase
    .from("project_stats")
    .select("*")
    .in("project_id", projects?.map((p) => p.id) || [])

  const statsMap = new Map(stats?.map((s) => [s.project_id, s]))

  const isOwner = user?.id === profile.id

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} profile={viewerProfile} />

      <ProfileHeader profile={profile} isOwner={isOwner} projectCount={projects?.length || 0} />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-6">Projects</h2>

        {projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{ ...project, profiles: profile }}
                stats={statsMap.get(project.id)}
                showAuthor={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No public projects yet</p>
          </div>
        )}
      </main>
    </div>
  )
}
