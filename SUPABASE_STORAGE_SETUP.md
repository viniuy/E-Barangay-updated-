# Supabase Storage Setup for Facility Images

## Required: Get your Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (this is a secret key - keep it safe!)
4. Add it to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Steps to create the storage bucket:

### Option 1: Using Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Enter bucket name: `facilities-image`
5. **IMPORTANT**: Check **Public bucket** (to allow public access to images)
6. Click **Create bucket**

### Option 2: Using SQL (in Supabase SQL Editor)

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the storage bucket as public
INSERT INTO storage.buckets (id, name, public)
VALUES ('facilities-image', 'facilities-image', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view images (public read access)
CREATE POLICY "Public Access for viewing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'facilities-image');

-- Allow service role to insert (handled by API with service_role key)
CREATE POLICY "Service role can insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'facilities-image');

-- Allow service role to update
CREATE POLICY "Service role can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'facilities-image');

-- Allow service role to delete
CREATE POLICY "Service role can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'facilities-image');
```

## Verify Setup

After creating the bucket, verify:
1. Bucket name is exactly: `facilities-image`
2. Bucket is marked as **Public**
3. You have added `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local`
4. Restart your development server after adding the environment variable

## Usage

The image upload is now integrated into the Admin Directory when
editing/creating facilities:

1. Select a facility category
2. An image upload field will appear
3. Select an image file
4. The image will be uploaded to Supabase storage when you save
5. The public URL will be stored in the `image_url` field in the database

## Image URLs

Images are stored with the following pattern:

- Bucket: `facilities-image`
- Filename: `{timestamp}-{random}.{extension}`
- Public URL:
  `https://{project_ref}.supabase.co/storage/v1/object/public/facilities-image/{filename}`
