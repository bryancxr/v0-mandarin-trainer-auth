-- Function to update user stats when lesson is completed
CREATE OR REPLACE FUNCTION public.update_user_lesson_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  -- Update total lessons and average rating
  UPDATE public.profiles
  SET 
    total_lessons = (
      SELECT COUNT(*) 
      FROM lessons 
      WHERE user_id = NEW.user_id AND rating IS NOT NULL
    ),
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM lessons 
      WHERE user_id = NEW.user_id AND rating IS NOT NULL
    ),
    updated_at = now()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$;

-- Trigger to update stats when lesson is rated
DROP TRIGGER IF EXISTS on_lesson_rated ON lessons;

CREATE TRIGGER on_lesson_rated
  AFTER INSERT OR UPDATE OF rating ON lessons
  FOR EACH ROW
  WHEN (NEW.rating IS NOT NULL)
  EXECUTE FUNCTION public.update_user_lesson_stats();
