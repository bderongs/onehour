-- Create enum for user roles
create type user_role as enum ('client', 'consultant', 'admin');

-- Create a table for user profiles
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    first_name text not null,
    last_name text not null,
    linkedin text,
    expertise text not null,
    experience text not null,
    role user_role not null default 'client',
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
create index profiles_role_idx on profiles (role);

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

-- Create a table for sparks
create table sparks (
    id uuid default uuid_generate_v4() primary key,
    consultant uuid references profiles(id),
    title text not null,
    duration text not null,
    price text,
    description text,
    benefits text[],
    prefill_text text not null,
    highlight text,
    url text not null unique,
    detailed_description text,
    methodology text[],
    target_audience text[],
    prerequisites text[],
    deliverables text[],
    expert_profile jsonb,
    faq jsonb[],
    testimonials jsonb[],
    next_steps text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table sparks enable row level security;

-- Create policies for sparks based on user roles
create policy "Sparks are viewable by everyone."
    on sparks for select
    using ( true );

create policy "Only consultants can insert sparks."
    on sparks for insert
    with check (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'consultant'
        )
        and auth.uid() = consultant
    );

create policy "Consultants can update their own sparks."
    on sparks for update
    using (
        exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'consultant'
        )
        and auth.uid() = consultant
    );

create policy "Consultants can delete their own sparks and admins can delete any spark."
    on sparks for delete
    using (
        (exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'consultant'
        )
        and auth.uid() = consultant)
        or
        (exists (
            select 1 from profiles
            where id = auth.uid()
            and role = 'admin'
        ))
    );

-- Create indexes
create index sparks_consultant_idx on sparks (consultant);
create index sparks_url_idx on sparks (url);

-- Set up trigger for updated_at
create trigger handle_sparks_updated_at
    before update on sparks
    for each row
    execute procedure handle_updated_at(); 