-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.project_analytics (
  project_id uuid NOT NULL,
  total_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  last_viewed_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_analytics_pkey PRIMARY KEY (project_id),
  CONSTRAINT project_analytics_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_comments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_comments_pkey PRIMARY KEY (id),
  CONSTRAINT project_comments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT project_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.project_likes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_likes_pkey PRIMARY KEY (id),
  CONSTRAINT project_likes_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id),
  CONSTRAINT project_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.project_metadata (
  project_id uuid NOT NULL,
  og_title character varying,
  og_description text,
  og_image text,
  twitter_card character varying DEFAULT 'summary_large_image'::character varying,
  twitter_title character varying,
  twitter_description text,
  twitter_image text,
  custom_meta jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_metadata_pkey PRIMARY KEY (project_id),
  CONSTRAINT project_metadata_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.project_views (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL,
  visitor_id character varying,
  ip_address inet,
  user_agent text,
  referer text,
  viewed_at timestamp with time zone DEFAULT now(),
  CONSTRAINT project_views_pkey PRIMARY KEY (id),
  CONSTRAINT project_views_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  name character varying NOT NULL,
  slug character varying NOT NULL,
  description text,
  html_content text DEFAULT ''::text,
  css_content text DEFAULT ''::text,
  js_content text DEFAULT ''::text,
  visibility character varying DEFAULT 'public'::character varying CHECK (visibility::text = ANY (ARRAY['public'::character varying, 'unlisted'::character varying, 'private'::character varying]::text[])),
  featured boolean DEFAULT false,
  views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id),
  CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_followers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  follower_id uuid NOT NULL,
  following_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_followers_pkey PRIMARY KEY (id),
  CONSTRAINT user_followers_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id),
  CONSTRAINT user_followers_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_sessions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  session_token character varying NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NOT NULL,
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  username character varying NOT NULL UNIQUE CHECK (username::text ~ '^[a-zA-Z0-9_-]+$'::text),
  email character varying NOT NULL UNIQUE,
  display_name character varying NOT NULL,
  verified boolean DEFAULT false,
  avatar_url text,
  banner_url text,
  bio text,
  github character varying,
  codepen character varying,
  linkedin character varying,
  instagram character varying,
  discord character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);