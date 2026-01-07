-- inserts a row into public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'role')::user_role,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();