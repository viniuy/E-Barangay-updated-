# Quick Fix for Image Upload Error

## The Error

```
StorageApiError: new row violates row-level security policy
status: 403
```

## The Solution

You need to add your **Supabase Service Role Key** to your environment
variables.

### Step 1: Get Your Service Role Key

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** (gear icon) → **API**
4. Scroll down to **Project API keys**
5. Copy the **service_role** key (NOT the anon key)
   - ⚠️ Keep this secret! Don't commit it to git!

### Step 2: Add to Environment Variables

Create or update your `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Replace the values with your actual keys from Supabase.

### Step 3: Create the Storage Bucket

1. Go to your Supabase dashboard
2. Click **Storage** in the sidebar
3. Click **New Bucket**
4. Name: `facilities-image`
5. **✓ Check "Public bucket"** ← This is important!
6. Click **Create bucket**

### Step 4: Restart Your Dev Server

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 5: Test the Upload

1. Go to Admin Directory
2. Click "Add New Item"
3. Select a facility category
4. Choose an image file
5. Create the item

It should now upload successfully!

## Troubleshooting

**Still getting 403 error?**

- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set correctly in `.env.local`
- Restart your dev server after adding the key
- Check that the bucket name is exactly `facilities-image`
- Verify the bucket is marked as "Public"

**Image not showing?**

- Check browser console for CORS errors
- Verify the bucket is public
- Check the image URL format in the database
