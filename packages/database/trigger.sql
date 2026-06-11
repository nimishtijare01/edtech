-- Create a function that handles new user signups from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public."User" (id, email, role, "passwordHash", "createdAt", "updatedAt")
  VALUES (
    new.id,
    new.email,
    'SUPER_ADMIN', -- Setting first users as SUPER_ADMIN temporarily, or default to a role
    'SUPABASE_AUTH_DELEGATED', -- We don't store passwords here, Supabase handles it
    now(),
    now()
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that calls the function whenever a new user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
