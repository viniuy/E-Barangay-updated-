-- Migration to ensure image_url field exists in items table
-- This field is already in the Prisma schema, this is just to verify/add it if missing

-- Add image_url column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'items' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE items ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Create storage bucket for facility images (if using Supabase)
-- Note: This requires Supabase CLI or Dashboard to execute
-- insert into storage.buckets (id, name, public)
-- values ('facilities-image', 'facilities-image', true)
-- on conflict (id) do nothing;

-- Create storage policy to allow public access (if using Supabase)
-- create policy "Public Access"
-- on storage.objects for select
-- using ( bucket_id = 'facilities-image' );

-- create policy "Authenticated users can upload"
-- on storage.objects for insert
-- with check ( bucket_id = 'facilities-image' and auth.role() = 'authenticated' );

-- create policy "Users can update their own images"
-- on storage.objects for update
-- using ( bucket_id = 'facilities-image' );

-- create policy "Users can delete their own images"
-- on storage.objects for delete
-- using ( bucket_id = 'facilities-image' );
