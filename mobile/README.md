# Rabbit Hole of the Day (RHOTD)

A content discovery app where users explore fascinating "rabbit holes" (topics) daily.

## Features

- **Today Screen**: View today's curated rabbit hole with title, hook, body content, tags, and links
- **Recent Screen**: Browse the last 7 days of rabbit holes
- **Archive Screen**: Premium users can search all posts and filter by tags
- **Suggest Screen**: Submit topic suggestions for future rabbit holes
- **Settings Screen**: Premium status, legal links, and support

## Tech Stack

- Expo SDK 53 with React Native
- Supabase for content storage
- Zustand for state management
- TanStack React Query for data fetching
- NativeWind (TailwindCSS) for styling

## Environment Variables

Add these to your `.env` file:

```
EXPO_PUBLIC_SUPABASE_PROJECT_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

## Supabase Tables

### posts
- `id` (uuid, primary key)
- `title` (text)
- `hook` (text)
- `body` (text)
- `links` (text array)
- `tags` (text array)
- `published_at` (timestamptz)
- `status` (text: 'draft' | 'published')
- `created_at` (timestamptz)

### suggestions
- `id` (uuid, primary key)
- `topic` (text)
- `description` (text, nullable)
- `submitted_at` (timestamptz)

## Premium Features

Premium access gates:
- Full archive access
- Search functionality
- Tag filtering

Currently using a placeholder boolean for premium status (toggle in Settings).

## External Links

- Privacy Policy: https://sofcon.online/rhotd/privacy
- Terms of Service: https://sofcon.online/rhotd/terms
- Support: https://sofcon.online/rhotd/support
- Content Policy: https://sofcon.online/rhotd/content-policy
