-- Fix security issue: Explicitly deny anonymous access to profiles table
-- The profiles table contains email addresses (PII) that must not be publicly accessible
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles
FOR SELECT
TO anon
USING (false);

-- Fix security issue: Explicitly deny anonymous access to user_roles table
-- Prevents attackers from enumerating which users have admin privileges
CREATE POLICY "Deny anonymous access to user_roles"
ON public.user_roles
FOR SELECT
TO anon
USING (false);