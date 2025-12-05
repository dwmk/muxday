import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Twitter, BadgeCheck } from "lucide-react";

// Initialize Supabase Client (Use ENV variables)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ProfilePage({ params }: { params: { username: string } }) {
  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single();

  if (!profile) return <div className="text-white p-10">User not found</div>;

  // Fetch Projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", profile.id)
    .eq("is_public", true);

  return (
    <div className="min-h-screen bg-mux-bg text-white">
      {/* Banner */}
      <div className="h-48 w-full bg-mux-surface relative overflow-hidden">
        {profile.banner_url ? (
          <img src={profile.banner_url} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-mux-blurple to-purple-600" />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          {/* Avatar */}
          <div className="relative h-32 w-32 rounded-full border-4 border-mux-bg overflow-hidden bg-mux-surface">
            <img 
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`} 
              alt={profile.username}
              className="h-full w-full object-cover" 
            />
          </div>
          
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {profile.display_name || profile.username}
              {profile.is_verified && <BadgeCheck className="text-mux-blurple" />}
            </h1>
            <p className="text-mux-muted">@{profile.username}</p>
          </div>

          <div className="flex gap-3 mb-4">
             {/* Socials - parsed from JSONB */}
             {profile.social_links?.github && <a href={profile.social_links.github} className="p-2 bg-mux-surface rounded-full hover:bg-mux-blurple transition"><Github size={20}/></a>}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6 max-w-2xl text-gray-300">
           {profile.bio || "No bio yet."}
        </div>

        <hr className="my-8 border-mux-surface" />

        {/* Projects Grid */}
        <h2 className="text-xl font-bold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((proj) => (
            <Link href={`/${profile.username}/${proj.slug}`} key={proj.id} className="group block">
              <div className="bg-mux-surface rounded-xl overflow-hidden border border-transparent group-hover:border-mux-blurple transition-all duration-300 shadow-lg">
                {/* Visual Preview could be an Iframe or screenshot */}
                <div className="h-40 bg-black/50 relative">
                   <div className="absolute inset-0 flex items-center justify-center text-mux-muted opacity-50 font-mono text-sm">&lt;/&gt;</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg group-hover:text-mux-blurple">{proj.title}</h3>
                  <div className="flex justify-between mt-2 text-sm text-mux-muted">
                     <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                     <span>{proj.views_count} views</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}