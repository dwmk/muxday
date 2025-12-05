import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { EditorLayout } from "@/components/editor/editor-layout"

interface EditorProjectPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditorProjectPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()

  const { data: project } = await supabase.from("projects").select("title").eq("id", id).single()

  return {
    title: project?.title || "Edit Project",
  }
}

export default async function EditorProjectPage({ params }: EditorProjectPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single()

  if (!project) {
    notFound()
  }

  // Check ownership
  if (project.user_id !== user.id) {
    redirect("/dashboard")
  }

  return <EditorLayout project={project} userId={user.id} />
}
