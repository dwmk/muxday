import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ProjectCard } from "@/components/project/project-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Plus, Code2 } from "lucide-react"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })

  const { data: stats } = await supabase
    .from("project_stats")
    .select("*")
    .in("project_id", projects?.map((p) => p.id) || [])

  const statsMap = new Map(stats?.map((s) => [s.project_id, s]))

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} profile={profile} />

      <main className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your projects</p>
          </div>
          <Button className="bg-blurple-500 hover:bg-blurple-600" asChild>
            <Link href="/editor">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="public">Public</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {projects && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="relative group">
                    <ProjectCard
                      project={{ ...project, profiles: profile || undefined }}
                      stats={statsMap.get(project.id)}
                      showAuthor={false}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/editor/${project.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="h-16 w-16 mx-auto rounded-full bg-blurple-500/10 flex items-center justify-center mb-4">
                  <Code2 className="h-8 w-8 text-blurple-500" />
                </div>
                <h3 className="text-lg font-semibold">No projects yet</h3>
                <p className="text-muted-foreground mt-1">Create your first project to get started</p>
                <Button className="mt-4 bg-blurple-500 hover:bg-blurple-600" asChild>
                  <Link href="/editor">Create Project</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="public" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                ?.filter((p) => p.is_public)
                .map((project) => (
                  <div key={project.id} className="relative group">
                    <ProjectCard
                      project={{ ...project, profiles: profile || undefined }}
                      stats={statsMap.get(project.id)}
                      showAuthor={false}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/editor/${project.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="private" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                ?.filter((p) => !p.is_public)
                .map((project) => (
                  <div key={project.id} className="relative group">
                    <ProjectCard
                      project={{ ...project, profiles: profile || undefined }}
                      stats={statsMap.get(project.id)}
                      showAuthor={false}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="secondary" asChild>
                        <Link href={`/editor/${project.id}`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
