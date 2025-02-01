-- First create the http extension
create extension if not exists "http" with schema extensions;

-- Then create the pg_net extension
create extension if not exists "pg_net";

-- Create a function to handle the webhook call
create or replace function public.handle_new_user()
returns trigger as $$
declare
  host text := current_setting('request.headers', true)::json->>'host';
begin
  perform
    net.http_post(
      url := 'http://' || coalesce(host, 'localhost:54321') || '/functions/v1/notify-signup',
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'schema', TG_TABLE_SCHEMA,
        'record', row_to_json(new),
        'old_record', case when TG_OP = 'UPDATE' then row_to_json(old) else null end
      )
    );
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
drop trigger if exists on_user_signup on public.profiles;
create trigger on_user_signup
  after insert
  on public.profiles
  for each row
  execute procedure public.handle_new_user();

-- Grant necessary permissions
grant execute on function public.handle_new_user() to authenticated;
grant execute on function public.handle_new_user() to service_role; 
