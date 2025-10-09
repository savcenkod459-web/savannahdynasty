-- Fix critical privilege escalation vulnerability in user_roles table
-- Add INSERT, UPDATE, DELETE policies to prevent unauthorized role modifications

-- Only admins can insert new roles (the SECURITY DEFINER trigger will bypass this)
CREATE POLICY "Only admins can assign roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can update existing roles
CREATE POLICY "Only admins can modify roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Only admins can delete roles
CREATE POLICY "Only admins can remove roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Fix security issue: Lock down profiles table to prevent unauthorized modifications
-- Profiles should only be created/modified by the system trigger (SECURITY DEFINER)

-- Deny all profile inserts (only the trigger should create profiles)
CREATE POLICY "Profiles can only be created by system"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (false);

-- Deny all profile updates (email shouldn't be user-modifiable)
CREATE POLICY "Profiles cannot be updated by users"
ON public.profiles
FOR UPDATE
TO authenticated
USING (false);

-- Deny all profile deletions (should cascade from auth.users only)
CREATE POLICY "Profiles cannot be deleted by users"
ON public.profiles
FOR DELETE
TO authenticated
USING (false);