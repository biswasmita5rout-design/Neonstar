
-- Atomic XP increment function to fix race condition
CREATE OR REPLACE FUNCTION public.increment_xp(p_user_id uuid, p_amount integer)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_xp integer;
  new_level integer;
BEGIN
  UPDATE public.profiles
  SET xp = xp + p_amount,
      level = GREATEST(1, FLOOR((xp + p_amount) / 500.0) + 1),
      updated_at = now()
  WHERE user_id = p_user_id
  RETURNING xp, level INTO new_xp, new_level;
  
  RETURN json_build_object('xp', new_xp, 'level', new_level);
END;
$$;

-- Add language preference to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS language_preference text NOT NULL DEFAULT 'en';
