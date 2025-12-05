export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  is_verified: boolean
  social_links: SocialLinks
  created_at: string
  updated_at: string
}

export interface SocialLinks {
  github?: string
  codepen?: string
  linkedin?: string
  instagram?: string
  discord?: string
  twitter?: string
  website?: string
}

export interface Project {
  id: string
  user_id: string
  slug: string
  title: string
  description: string | null
  html_code: string
  css_code: string
  js_code: string
  is_public: boolean
  is_featured: boolean
  thumbnail_url: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface ProjectStats {
  project_id: string
  total_views: number
  unique_visitors: number
  last_viewed_at: string | null
}

export interface ProjectAnalytics {
  id: string
  project_id: string
  visitor_id: string
  ip_hash: string | null
  user_agent: string | null
  referrer: string | null
  country: string | null
  viewed_at: string
}
