import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project/project-card"
import Link from "next/link"
import { Code2, Zap, Shield, Users } from "lucide-react"

export default async function HomePage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  // Fetch featured/recent projects
  const { data: projects } = await supabase
    .from("projects")
    .select(`*, profiles(*)`)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} profile={profile} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blurple-600/20 via-background to-background" />
        <div className="container relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blurple-500/10 border border-blurple-500/20 text-blurple-400 text-sm">
              <Zap className="h-4 w-4" />
              Build, Preview, Share - All in One Place
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Code Your Ideas Into
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blurple-400 to-blurple-600">
                {" "}
                Reality
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              MuxDay is a modern IDE for building and sharing static HTML, CSS, and JavaScript projects. Write code,
              preview instantly, and publish with one click.
            </p>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button size="lg" className="bg-blurple-500 hover:bg-blurple-600" asChild>
                <Link href={user ? "/editor" : "/auth?mode=register"}>Start Building</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/explore">Explore Projects</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-blurple-500/10 flex items-center justify-center mb-4">
              <Code2 className="h-6 w-6 text-blurple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Powerful Editor</h3>
            <p className="text-muted-foreground">
              Syntax highlighting, auto-completion, and real-time preview for HTML, CSS, and JavaScript.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-blurple-500/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blurple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Sandbox</h3>
            <p className="text-muted-foreground">
              Your code runs in an isolated sandbox, ensuring safety without compromising functionality.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="h-12 w-12 rounded-lg bg-blurple-500/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-blurple-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Share & Collaborate</h3>
            <p className="text-muted-foreground">
              Public profiles, project sharing, and detailed analytics for your creations.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      {projects && projects.length > 0 && (
        <section className="container max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Recent Projects</h2>
            <Button variant="outline" asChild>
              <Link href="/explore">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blurple-500 flex items-center justify-center">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">MuxDay</span>
            </div>
            <p className="text-sm text-muted-foreground">Built with Next.js and Supabase. Open source.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
