import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditorLayout } from "@/components/editor/editor-layout"

export const metadata = {
  title: "New Project",
}

export default async function NewEditorPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return <EditorLayout userId={user.id} />
}
