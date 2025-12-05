# MuxDay - Code, Create, Share

A modern, CodePen-like static site IDE built with pure HTML, CSS, JavaScript, and Supabase PostgreSQL.

## Setup Instructions

### Prerequisites
- A Supabase account (free tier works)
- A Vercel account (free tier works)

### Step 1: Set Up Supabase

1. **Create a new Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details and wait for setup to complete

2. **Run the database initialization:**
   - In your Supabase dashboard, go to "SQL Editor"
   - Copy the entire contents of `database.sql`
   - Paste and execute the SQL commands

3. **Create storage bucket:**
   - Go to "Storage" in Supabase dashboard
   - Click "Create a new bucket"
   - Name it `user-uploads`
   - Make it **Public**
   - The storage policies are already set up via the SQL script

4. **Get your project credentials:**
   - Go to "Settings" > "API"
   - Copy your `Project URL` (SUPABASE_URL)
   - Copy your `anon public` key (SUPABASE_ANON_KEY)

### Step 2: Configure the Application

1. **Update config.js:**
   - Open `config.js`
   - Replace `YOUR_SUPABASE_URL` with your Project URL
   - Replace `YOUR_SUPABASE_ANON_KEY` with your anon public key

### Step 3: Deploy to Vercel

1. **Prepare your repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub:**
   - Create a new repository on GitHub
   - Follow GitHub's instructions to push your code

3. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a static site
   - Click "Deploy"

4. **Configure custom domain (optional):**
   - In Vercel dashboard, go to "Settings" > "Domains"
   - Add your custom domain

### Step 4: Configure Email (Optional)

For user authentication emails to work properly:

1. In Supabase dashboard, go to "Authentication" > "Email Templates"
2. Customize your email templates
3. For production, set up a custom SMTP server in "Settings" > "Auth"

## Features Implemented

### Core Features
- ✅ **CodePen-like Editor** - Split-panel WYSIWYG editor for HTML, CSS, and JavaScript
- ✅ **Syntax Highlighting** - CodeMirror integration with Material Darker theme
- ✅ **Live Preview** - Real-time rendering with sandboxed iframe for security
- ✅ **Project Management** - Create, save, edit, and delete projects
- ✅ **User Authentication** - Email/password authentication via Supabase Auth

### User Profiles
- ✅ **Customizable Profiles** - Username, display name, bio
- ✅ **Avatar & Banner** - Upload images or use remote URLs
- ✅ **Verified Badge** - Display verification status
- ✅ **Social Media Links** - GitHub, CodePen, LinkedIn, Instagram, Discord
- ✅ **Profile URLs** - Access profiles via `/username`

### Project Features
- ✅ **Public/Private Projects** - Control project visibility
- ✅ **Project URLs** - Access projects via `/username/project-slug`
- ✅ **Project Forking** - Fork other users' public projects
- ✅ **View Analytics** - Track views and unique visitors
- ✅ **Code Display** - Toggle code view on project pages

### UI/UX
- ✅ **Discord Blurple Theme** - Modern dark theme with blurple accents
- ✅ **Responsive Design** - Separate layouts for desktop and mobile
- ✅ **Smooth Animations** - Page transitions and hover effects
- ✅ **Modal System** - Clean modals for auth and profile editing

### Security
- ✅ **Sandboxed Preview** - iframe sandbox prevents malicious code execution
- ✅ **Row Level Security** - Supabase RLS policies protect data
- ✅ **XSS Prevention** - Proper escaping and sandboxing
- ✅ **SQL Injection Protection** - Parameterized queries via Supabase

### Storage & Analytics
- ✅ **Supabase Storage** - Image uploads to cloud storage
- ✅ **Project Analytics** - View counts and visitor tracking
- ✅ **OpenGraph Support** - Meta tags for social media sharing

### Additional Features
- ✅ **Trending Projects** - Discover popular projects on homepage
- ✅ **User Projects Gallery** - View all projects by a user
- ✅ **Auto-save** - Debounced auto-run on code changes
- ✅ **Share Projects** - Copy project links to clipboard
- ✅ **Mobile Menu** - Hamburger menu for mobile navigation

## Technology Stack

- **Frontend:** Pure HTML5, CSS3, JavaScript (ES6+)
- **Editor:** CodeMirror 5
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Hosting:** Vercel (Static Site)
- **Theme:** Discord Blurple color scheme

## File Structure

```
muxday/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling
├── app.js             # Application logic
├── config.js          # Supabase configuration
├── database.sql       # Database initialization
└── README.md          # This file
```

## Security Considerations

1. **Sandboxed iframe** - The preview uses `sandbox="allow-scripts"` to prevent malicious code from accessing parent page
2. **Row Level Security** - All database tables have RLS policies
3. **No localStorage** - Uses Supabase auth tokens instead
4. **Input validation** - Username and slug sanitization
5. **HTTPS only** - Vercel provides automatic HTTPS

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please create an issue on the GitHub repository.