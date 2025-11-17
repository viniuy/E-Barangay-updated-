A comprehensive online government service portal with modern UI design, accessibility features, and responsive layout.

## Features

- 🏛️ **Main Dashboard** - Categorized services with quick access and statistics
- 📋 **Service Directory** - Advanced filtering and search functionality
- 📝 **Service Application** - Step-by-step multi-form application process
- 🌐 **Multi-language Support** - English, Sinhala, and Tamil
- 📱 **Responsive Design** - Works on all devices
- ♿ **Accessible** - Built with accessibility in mind
- 🔐 **Prisma ORM** - Type-safe database access with Prisma
- 🌐 **RESTful API** - Clean API routes using Next.js App Router
- 📡 **Axios Integration** - Centralized HTTP client for all API calls

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Supabase PostgreSQL)
- A Supabase account and project (for authentication - optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd E-Barangay-updated-
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your database connection string:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
     ```
   - For Supabase, you can find the connection string in: Settings > Database > Connection string (URI)
   - Optional: If using Supabase Auth:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - Optional: Custom API URL (defaults to `/api`):
     ```env
     NEXT_PUBLIC_API_URL="/api"
     ```

4. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations (if you have migrations)
npm run prisma:migrate

# Or use Prisma Studio to view/manage data
npm run prisma:studio
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:3000
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **API**: Next.js API Routes with axios
- **Authentication**: Supabase Auth (optional)
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Maps**: Leaflet
- **Forms**: React Hook Form

## Project Structure

```
├── app/
│   ├── api/              # API routes (using Prisma)
│   │   ├── categories/
│   │   ├── items/
│   │   ├── requests/
│   │   └── statistics/
│   ├── actions/          # Server actions (legacy - being migrated)
│   └── page.tsx
├── components/           # React components
├── lib/
│   ├── api/              # API client functions (using axios)
│   ├── hooks/            # React hooks
│   ├── prisma.ts         # Prisma client instance
│   └── axios.ts          # Axios instance configuration
├── prisma/
│   └── schema.prisma     # Prisma schema
└── public/
```

## API Endpoints

All API endpoints are prefixed with `/api`:

- `GET /api/categories` - Get all categories
- `GET /api/categories?id={id}` - Get category by ID
- `GET /api/items` - Get all items (supports `type`, `categoryId`, `search` query params)
- `GET /api/items?id={id}` - Get item by ID
- `GET /api/requests` - Get all requests (supports `userId`, `status` query params)
- `POST /api/requests` - Create a new request
- `PATCH /api/requests` - Update request status
- `GET /api/statistics` - Get aggregated statistics

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
├── app/                         # Next.js App Router directory
│   ├── layout.tsx              # Root layout component
│   ├── page.tsx                # Home page
│   └── middleware.ts           # Supabase auth middleware
├── components/
│   ├── admin/                  # Admin components
│   ├── user/                   # User-facing components
│   └── ui/                     # Reusable UI components (shadcn/ui)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Client-side Supabase client
│   │   └── server.ts           # Server-side Supabase client
│   └── utils.ts                # Utility functions
├── styles/
│   └── global.css              # Tailwind CSS configuration
└── public/                     # Static assets
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Supabase** - Backend as a service (database, auth, storage)
- **shadcn/ui** - UI component library
- **Lucide React** - Icons

## Deployment on Vercel

This project is optimized for deployment on Vercel. Follow these steps:

### 1. Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
5. Click "Deploy"

### 3. Post-Deployment

- Your app will be live at `https://your-project.vercel.app`
- Vercel automatically handles:
  - Build optimization
  - Serverless functions
  - Edge network distribution
  - Automatic HTTPS

### Environment Variables on Vercel

Make sure to add your environment variables in the Vercel dashboard:
- Go to your project settings
- Navigate to "Environment Variables"
- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Setup

### 1. Database Setup

1. Go to your Supabase project SQL Editor
2. Run the SQL schema provided earlier to create all tables
3. Run `supabase-setup.sql` to set up:
   - Database triggers to sync auth users with your users table
   - Row Level Security (RLS) policies
   - Proper access controls

### 2. Authentication Setup

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure email settings (optional but recommended)
3. Enable email confirmation if desired
4. Set up your email templates

### 3. Security Best Practices

- **Row Level Security (RLS)**: Always enable RLS on your Supabase tables
- **Client vs Server**: 
  - Use `lib/supabase/client.ts` for client components (browser)
  - Use `lib/supabase/server.ts` for server components and API routes
- **Never expose service role key**: The service role key should only be used in secure server-side contexts

### 4. Using Supabase in Your Components

**Client Components:**
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
// Use supabase client here
```

**Server Components:**
```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
// Use supabase client here
```

### 5. Authentication

The app now includes:
- **Login/Signup**: Click "Log In" or "Sign Up" in the header
- **User Dashboard**: View all your requests when logged in
- **Protected Routes**: Service applications require authentication
- **Automatic User Sync**: New users are automatically added to the users table via database trigger

### 6. Database Access Check

The app automatically checks if database access is needed:
- **Public Data**: Categories, items (services/facilities) - accessible to everyone
- **User Data**: Requests, user profile - requires authentication
- **Admin Data**: Request management - requires admin role (to be implemented)

## License

This project is for demonstration purposes.