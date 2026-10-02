# Excellence Training Center — V2

This is the next-stage ETC website.

## Included
- Public responsive website
- Programs and course pages
- Online Academy lesson library
- Registration form
- Admin dashboard
- Lesson creation workflow
- Registration viewing
- Supabase-ready database schema
- Supabase-ready authentication architecture
- Prepared media-upload area
- Mobile-friendly design

## Important
Without a connected backend, the site runs in DEMO MODE. Demo lessons/registrations are stored in the browser only.

## To make it a REAL online platform
1. Create a Supabase project.
2. Open SQL Editor and run `schema.sql`.
3. Create Storage buckets: `etc-images`, `etc-videos`, `etc-pdfs`.
4. Copy `config.example.js` to `config.js`.
5. Put your Supabase project URL and publishable key in `config.js`.
6. Add proper Row Level Security policies for admin/student roles.
7. Connect the admin login to Supabase Auth.
8. Deploy the static frontend to GitHub Pages, Netlify, Vercel, etc.

Do NOT put a Supabase service_role key in browser code.
