-- Drop existing restrictive policy that's blocking non-admins
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Create new permissive policy that allows anyone to insert messages
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
TO authenticated
WITH CHECK (true);