-- Add attempts column to password_reset_codes table for tracking verification attempts
ALTER TABLE public.password_reset_codes 
ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0;

-- Add locked column to prevent brute force after too many attempts
ALTER TABLE public.password_reset_codes 
ADD COLUMN IF NOT EXISTS locked boolean NOT NULL DEFAULT false;

-- Create index for faster rate limit queries
CREATE INDEX IF NOT EXISTS idx_password_reset_codes_email_created 
ON public.password_reset_codes(user_email, created_at DESC);