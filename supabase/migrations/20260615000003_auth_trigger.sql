-- Auto-create a profiles row when a new auth.users row is inserted
CREATE OR REPLACE FUNCTION on_user_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, is_admin)
    VALUES (NEW.id, FALSE);
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION on_user_created();
