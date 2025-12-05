import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Code2 } from "lucide-react"
import type { Project, Profile } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"

interface ProjectCardProps {
  project: Project & { profiles?: Profile }
  stats?: { total_views: number; unique_visitors: number }
  showAuthor?: boolean
}

export function ProjectCard({ project, stats, showAuthor = true }: ProjectCardProps) {
  const profile = project.profiles

  return (
    <Card className="overflow-hidden group hover:border-blurple-500/50 transition-colors">
      <Link href={`/${profile?.username}/${project.slug}`}>
        <div className="aspect-video bg-gradient-to-br from-blurple-900/50 to-background relative overflow-hidden">
          {project.thumbnail_url ? (
            <img
              src={project.thumbnail_url || "/placeholder.svg"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Code2 className="h-12 w-12 text-blurple-500/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/${profile?.username}/${project.slug}`}>
          <h3 className="font-semibold truncate hover:text-blurple-400 transition-colors">{project.title}</h3>
        </Link>
        {project.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        {showAuthor && profile && (
          <Link href={`/${profile.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar className="h-6 w-6">
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className="text-xs bg-blurple-500">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">@{profile.username}</span>
          </Link>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {stats && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {stats.total_views}
            </span>
          )}
          <span>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
