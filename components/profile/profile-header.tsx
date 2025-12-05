"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Github, Linkedin, Instagram, ExternalLink, Settings } from "lucide-react"
import type { Profile } from "@/lib/types"
import Link from "next/link"

interface ProfileHeaderProps {
  profile: Profile
  isOwner?: boolean
  projectCount?: number
}

export function ProfileHeader({ profile, isOwner, projectCount = 0 }: ProfileHeaderProps) {
  const socialIcons: Record<string, React.ReactNode> = {
    github: <Github className="h-4 w-4" />,
    linkedin: <Linkedin className="h-4 w-4" />,
    instagram: <Instagram className="h-4 w-4" />,
    discord: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
    codepen: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.144 13.067v-2.134L16.55 12zm1.276 1.194a.628.628 0 0 1-.006.083l-.005.028-.011.053-.01.031c-.005.016-.01.031-.017.047l-.014.03a.78.78 0 0 1-.021.043l-.019.03a.57.57 0 0 1-.08.1l-.026.025a.602.602 0 0 1-.036.033l-.029.024-.041.028-.034.022-5.09 3.395a.628.628 0 0 1-.698 0l-5.09-3.395-.034-.022-.042-.028-.028-.024a.706.706 0 0 1-.037-.033l-.025-.025a.57.57 0 0 1-.08-.1l-.019-.03-.021-.043-.014-.03c-.007-.016-.012-.031-.017-.047l-.01-.031c-.004-.018-.008-.035-.011-.053l-.005-.028a.628.628 0 0 1-.006-.083V9.739c0-.028.002-.055.006-.083l.005-.028.011-.053.01-.031c.005-.016.01-.031.017-.047l.014-.03.021-.043.019-.03a.57.57 0 0 1 .08-.1l.025-.025.037-.033.028-.024.042-.028.034-.022 5.09-3.395a.628.628 0 0 1 .698 0l5.09 3.395.034.022.041.028.029.024.036.033.026.025a.57.57 0 0 1 .08.1l.019.03.021.043.014.03c.007.016.012.031.017.047l.01.031c.004.018.008.035.011.053l.005.028c.004.028.006.055.006.083zm-1.276-3.994l-1.593 1.067 1.593 1.067zM12 10.329l-1.91 1.283 1.91 1.283 1.91-1.283zm-.628-1.262L7.89 11.49v2.396l2.395-1.597 1.087-.73zM6.058 13.067v2.134l1.594-1.067zm5.314 3.596l3.482-2.323v-2.396l-2.395 1.597z" />
      </svg>
    ),
    website: <ExternalLink className="h-4 w-4" />,
  }

  return (
    <div className="relative">
      {/* Banner */}
      <div
        className="h-32 md:h-48 bg-gradient-to-r from-blurple-600 to-blurple-400 rounded-b-lg"
        style={
          profile.banner_url
            ? { backgroundImage: `url(${profile.banner_url})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      />

      <div className="container max-w-4xl mx-auto px-4">
        <div className="relative -mt-16 md:-mt-20">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background ring-4 ring-blurple-500/20">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
              <AvatarFallback className="text-2xl md:text-4xl bg-blurple-500">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">{profile.display_name || profile.username}</h1>
                {profile.is_verified && (
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-blurple-500 fill-blurple-500/20" />
                )}
              </div>
              <p className="text-muted-foreground">@{profile.username}</p>
              {profile.bio && <p className="mt-2 text-sm md:text-base max-w-2xl">{profile.bio}</p>}

              {/* Social Links */}
              {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {Object.entries(profile.social_links).map(([key, value]) =>
                    value ? (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                      >
                        {socialIcons[key] || <ExternalLink className="h-4 w-4" />}
                        <span className="capitalize">{key}</span>
                      </a>
                    ) : null,
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>
                  <strong className="text-foreground">{projectCount}</strong> projects
                </span>
              </div>
            </div>

            {/* Actions */}
            {isOwner && (
              <div className="pb-4">
                <Button asChild variant="outline" size="sm">
                  <Link href="/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
