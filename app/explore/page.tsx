import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { ProjectCard } from "@/components/project/project-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export const metadata = {
  title: "Explore Projects",
}

export default async function ExplorePage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  const { data: projects } = await supabase
    .from("projects")
    .select(`*, profiles(*)`)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: stats } = await supabase
    .from("project_stats")
    .select("*")
    .in("project_id", projects?.map((p) => p.id) || [])

  const statsMap = new Map(stats?.map((s) => [s.project_id, s]))

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} profile={profile} />

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Explore</h1>
          <p className="text-muted-foreground mt-1">Discover projects from the community</p>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search projects..." className="pl-10 max-w-md" />
        </div>

        {projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} stats={statsMap.get(project.id)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        )}
      </main>
    </div>
  )
}
