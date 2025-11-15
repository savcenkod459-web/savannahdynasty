-- Create translations table
CREATE TABLE IF NOT EXISTS public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code VARCHAR(5) NOT NULL,
  translation_key TEXT NOT NULL,
  translation_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(language_code, translation_key)
);

-- Enable RLS
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read translations
CREATE POLICY "Anyone can view translations"
  ON public.translations
  FOR SELECT
  USING (true);

-- Only admins can insert, update, delete translations
CREATE POLICY "Admins can insert translations"
  ON public.translations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update translations"
  ON public.translations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete translations"
  ON public.translations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create index for faster queries
CREATE INDEX idx_translations_language ON public.translations(language_code);
CREATE INDEX idx_translations_key ON public.translations(translation_key);

-- Create trigger for updated_at
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();