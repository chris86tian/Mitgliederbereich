# Modern Video Platform

This is a modern, clean video platform built with Next.js, Tailwind CSS, Supabase, and NextAuth.js. It supports courses with chapters and videos, progress tracking, community comments with likes and replies, user dashboards, and an admin interface.

## Features

- Courses with chapters and embedded videos (YouTube, Vimeo, S3)
- Video progress tracking with "Mark as watched" button
- Community comments with like and reply functionality
- User dashboard showing enrolled courses and progress
- Profile page with avatar and user info
- Admin interface for managing courses and users
- Dark/Light mode toggle with Tailwind CSS
- Responsive and modern UI with glassmorphism effects
- Supabase for database and authentication backend
- NextAuth.js for authentication with email sign-in
- Deployment ready with Dokploy and Docker

## Setup

1. Clone the repository (or start from this template)
2. Create a `.env.local` file in the root with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXTAUTH_SECRET=your_nextauth_secret
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=your-email@example.com
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment

This project is configured for Dokploy:

- The `dokploy.yaml` file defines automatic deployment on push to `main`.
- The `Dockerfile` builds and runs the Next.js app in production mode.

To deploy:

- Push your code to the `main` branch.
- Dokploy will build and deploy automatically.

## Database

Set up your Supabase database with tables for:

- `users` (managed by Supabase Auth)
- `profiles` (avatar_url, full_name, etc.)
- `courses` (title, description)
- `chapters` (course_id, title)
- `videos` (chapter_id, title, url, provider)
- `video_progress` (user_id, video_id, watched)
- `comments` (user_id, video_id, content, parent_id)
- `comment_likes` (user_id, comment_id, liked)
- `course_progress` (user_id, course_id, progress_percent)

Enable Row Level Security and policies for user data protection.

## Notes

- Admin and instructor roles should be managed via Supabase roles or a custom role system.
- The admin interface currently supports course listing and editing basics.
- Extend the admin UI and API routes as needed.

---

Enjoy building your video platform!
