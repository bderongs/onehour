-- Add the slug column if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'slug') then
        alter table profiles add column slug text unique;
    end if;
end $$;

-- Create a function to generate a slug
create or replace function generate_slug(text) returns text as $$
declare
    base_slug text;
    new_slug text;
    counter integer;
begin
    -- Convert to lowercase and replace special characters
    base_slug := lower($1);
    base_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
    base_slug := trim(both '-' from base_slug);
    base_slug := substring(base_slug from 1 for 100);
    
    -- Try the base slug first
    new_slug := base_slug;
    counter := 1;
    
    -- Keep trying with incremented numbers until we find a unique slug
    while exists(select 1 from profiles where slug = new_slug) loop
        counter := counter + 1;
        new_slug := base_slug || '-' || counter::text;
    end loop;
    
    return new_slug;
end;
$$ language plpgsql;

-- Generate slugs for existing consultants
do $$
declare
    r record;
begin
    for r in 
        select id, first_name, last_name 
        from profiles 
        where roles @> array['consultant']::user_role[] 
        and (slug is null or slug = '')
    loop
        update profiles 
        set slug = generate_slug(r.first_name || ' ' || r.last_name)
        where id = r.id;
    end loop;
end $$;

-- Add a constraint to require slug for consultants
alter table profiles
    add constraint consultant_slug_required
    check (
        not (roles @> array['consultant']::user_role[]) or
        (slug is not null and slug <> '')
    );

-- Create an index for slug lookups
create index if not exists profiles_slug_idx on profiles (slug);

-- Drop the temporary function
drop function if exists generate_slug(text); 