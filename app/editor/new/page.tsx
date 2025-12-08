// app/editor/new/page.tsx
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Editor from "@/components/editor/editor"; // ← our new unified component

export const metadata = {
  title: "New Project • MuxDay",
};

export default async function NewEditorPage() {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return <Editor userId={user.id} />;
}
