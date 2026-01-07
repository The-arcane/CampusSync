-- This function is triggered when a new user signs up.
-- It inserts a new row into the public.profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a new profile record for the new user.
  -- The 'role' is defaulted to 'parent' as it's the most common sign-up type.
  -- You can adjust the default role as needed.
  -- The 'full_name' is extracted from the user's metadata, defaulting to a placeholder if not provided.
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    'parent'::user_role
  );
  RETURN NEW;
END;
$$;

-- This trigger calls the handle_new_user function after a new user is created in the auth.users table.
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
