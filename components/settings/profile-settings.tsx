"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Profile, SocialLinks } from "@/lib/types"
import { Loader2, LinkIcon, Github, Linkedin, Instagram } from "lucide-react"

interface ProfileSettingsProps {
  profile: Profile
}

export function ProfileSettings({ profile: initialProfile }: ProfileSettingsProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarMode, setAvatarMode] = useState<"url" | "upload">("upload")
  const [bannerMode, setBannerMode] = useState<"url" | "upload">("upload")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "")
  const [bannerUrl, setBannerUrl] = useState(profile.banner_url || "")

  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profile.display_name,
          bio: profile.bio,
          avatar_url: avatarUrl,
          banner_url: bannerUrl,
          social_links: profile.social_links,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error
      toast({ title: "Profile updated successfully!" })
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (file: File, type: "avatar" | "banner") => {
    setUploading(true)
    try {
      const bucket = type === "avatar" ? "avatars" : "banners"
      const fileExt = file.name.split(".").pop()
      const fileName = `${profile.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName)

      if (type === "avatar") {
        setAvatarUrl(publicUrl)
      } else {
        setBannerUrl(publicUrl)
      }

      toast({ title: `${type === "avatar" ? "Avatar" : "Banner"} uploaded!` })
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const updateSocialLink = (key: keyof SocialLinks, value: string) => {
    setProfile({
      ...profile,
      social_links: {
        ...profile.social_links,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details visible to others.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={profile.username} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground">Username cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={profile.display_name || ""}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              placeholder="Your display name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Upload an image or provide a URL.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-2xl bg-blurple-500">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <Tabs value={avatarMode} onValueChange={(v) => setAvatarMode(v as "url" | "upload")}>
              <TabsList>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="mt-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file, "avatar")
                  }}
                  disabled={uploading}
                />
              </TabsContent>
              <TabsContent value="url" className="mt-2">
                <Input
                  placeholder="https://example.com/avatar.png"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Banner */}
      <Card>
        <CardHeader>
          <CardTitle>Banner</CardTitle>
          <CardDescription>Upload a banner image or provide a URL.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="h-32 rounded-lg bg-gradient-to-r from-blurple-600 to-blurple-400"
            style={
              bannerUrl
                ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined
            }
          />

          <Tabs value={bannerMode} onValueChange={(v) => setBannerMode(v as "url" | "upload")}>
            <TabsList>
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file, "banner")
                }}
                disabled={uploading}
              />
            </TabsContent>
            <TabsContent value="url" className="mt-2">
              <Input
                placeholder="https://example.com/banner.png"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Connect your social media profiles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="https://github.com/username"
                value={profile.social_links?.github || ""}
                onChange={(e) => updateSocialLink("github", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.144 13.067v-2.134L16.55 12zm1.276 1.194a.628.628 0 0 1-.006.083l-.005.028-.011.053-.01.031c-.005.016-.01.031-.017.047l-.014.03a.78.78 0 0 1-.021.043l-.019.03a.57.57 0 0 1-.08.1l-.026.025a.602.602 0 0 1-.036.033l-.029.024-.041.028-.034.022-5.09 3.395a.628.628 0 0 1-.698 0l-5.09-3.395-.034-.022-.042-.028-.028-.024a.706.706 0 0 1-.037-.033l-.025-.025a.57.57 0 0 1-.08-.1l-.019-.03-.021-.043-.014-.03c-.007-.016-.012-.031-.017-.047l-.01-.031c-.004-.018-.008-.035-.011-.053l-.005-.028a.628.628 0 0 1-.006-.083V9.739c0-.028.002-.055.006-.083l.005-.028.011-.053.01-.031c.005-.016.01-.031.017-.047l.014-.03.021-.043.019-.03a.57.57 0 0 1 .08-.1l.025-.025.037-.033.028-.024.042-.028.034-.022 5.09-3.395a.628.628 0 0 1 .698 0l5.09 3.395.034.022.041.028.029.024.036.033.026.025a.57.57 0 0 1 .08.1l.019.03.021.043.014.03c.007.016.012.031.017.047l.01.031c.004.018.008.035.011.053l.005.028c.004.028.006.055.006.083zm-1.276-3.994l-1.593 1.067 1.593 1.067zM12 10.329l-1.91 1.283 1.91 1.283 1.91-1.283zm-.628-1.262L7.89 11.49v2.396l2.395-1.597 1.087-.73zM6.058 13.067v2.134l1.594-1.067zm5.314 3.596l3.482-2.323v-2.396l-2.395 1.597z" />
              </svg>
              <Input
                placeholder="https://codepen.io/username"
                value={profile.social_links?.codepen || ""}
                onChange={(e) => updateSocialLink("codepen", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Linkedin className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="https://linkedin.com/in/username"
                value={profile.social_links?.linkedin || ""}
                onChange={(e) => updateSocialLink("linkedin", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Instagram className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="https://instagram.com/username"
                value={profile.social_links?.instagram || ""}
                onChange={(e) => updateSocialLink("instagram", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <Input
                placeholder="Discord username"
                value={profile.social_links?.discord || ""}
                onChange={(e) => updateSocialLink("discord", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="https://yourwebsite.com"
                value={profile.social_links?.website || ""}
                onChange={(e) => updateSocialLink("website", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full bg-blurple-500 hover:bg-blurple-600">
        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </div>
  )
}
