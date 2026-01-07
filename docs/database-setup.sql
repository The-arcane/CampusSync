-- Drop the existing trigger and function to ensure a clean re-creation.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user;

-- Create the function to insert a new user into the public.profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
    CASE
      WHEN new.raw_user_meta_data->>'role' IS NULL THEN 'parent'::user_role
      ELSE (new.raw_user_meta_data->>'role')::user_role
    END
  );
  RETURN new;
END;
$$;

-- Create the trigger to call the function after a new user is created in auth.users.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
