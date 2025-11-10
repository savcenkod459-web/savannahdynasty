-- Extend profiles table with additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update RLS policies to allow users to update their own profiles
DROP POLICY IF EXISTS "Profiles cannot be updated by users" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create table for cat pedigrees (родословная)
CREATE TABLE IF NOT EXISTS public.cat_pedigrees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cat_id UUID NOT NULL REFERENCES public.cats(id) ON DELETE CASCADE,
  parent_type TEXT NOT NULL CHECK (parent_type IN ('father', 'mother')),
  parent_name TEXT NOT NULL,
  parent_breed TEXT NOT NULL,
  parent_description TEXT,
  parent_images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on cat_pedigrees
ALTER TABLE public.cat_pedigrees ENABLE ROW LEVEL SECURITY;

-- Allow public read access to pedigrees
CREATE POLICY "Allow public read access to cat pedigrees"
ON public.cat_pedigrees
FOR SELECT
USING (true);

-- Only admins can manage pedigrees
CREATE POLICY "Only admins can insert cat pedigrees"
ON public.cat_pedigrees
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update cat pedigrees"
ON public.cat_pedigrees
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete cat pedigrees"
ON public.cat_pedigrees
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at on cat_pedigrees
CREATE TRIGGER update_cat_pedigrees_updated_at
BEFORE UPDATE ON public.cat_pedigrees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for site images management
CREATE TABLE IF NOT EXISTS public.site_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on site_images
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to site images
CREATE POLICY "Allow public read access to site images"
ON public.site_images
FOR SELECT
USING (true);

-- Only admins can manage site images
CREATE POLICY "Only admins can insert site images"
ON public.site_images
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update site images"
ON public.site_images
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete site images"
ON public.site_images
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at on site_images
CREATE TRIGGER update_site_images_updated_at
BEFORE UPDATE ON public.site_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();