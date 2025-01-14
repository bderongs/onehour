-- Create a table for user profiles
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    first_name text not null,
    last_name text not null,
    linkedin text,
    expertise text not null,
    experience text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
    on profiles for select
    using ( true );

-- Allow profile creation during signup
create policy "Anyone can insert a profile during signup."
    on profiles for insert
    with check ( true );

create policy "Users can update own profile."
    on profiles for update
    using ( auth.uid() = id );

-- Create indexes
create index profiles_email_idx on profiles (email);

-- Set up triggers for updated_at
create function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_profiles_updated_at
    before update on profiles
    for each row
    execute procedure handle_updated_at(); 