-- Добавляем индекс для эффективной проверки rate limiting
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at);

-- Функция для проверки rate limiting
CREATE OR REPLACE FUNCTION public.check_message_rate_limit(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  message_count integer;
BEGIN
  -- Подсчитываем сообщения от этого email за последний час
  SELECT COUNT(*) INTO message_count
  FROM public.contact_messages
  WHERE email = user_email
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Возвращаем true если лимит не превышен (максимум 3 сообщения в час)
  RETURN message_count < 3;
END;
$$;