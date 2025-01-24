/*
 * IDEMPOTENT DATABASE SCHEMA
 * This script is designed to be safely run multiple times on a Supabase instance.
 * It includes existence checks for:
 * - Types (enums)
 * - Tables
 * - Columns
 * - Policies
 * - Indexes
 * - Triggers
 * 
 * This means:
 * 1. It won't error if objects already exist
 * 2. It will only add what's missing
 * 3. It's safe to run during development to update schema
 */

-- Check and create user_role enum if it doesn't exist
do $$ 
begin
    if not exists (select 1 from pg_type where typname = 'user_role') then
        create type user_role as enum ('client', 'consultant', 'admin');
    end if;
end $$;

-- Create a table for user profiles if it doesn't exist
create table if not exists profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    first_name text not null,
    last_name text not null,
    role user_role not null default 'client',
    
    -- Basic profile info
    title text, -- e.g. "Expert en Transformation Digitale & Innovation"
    bio text, -- Long form description
    company text,
    company_title text, -- Role at company
    location text, -- e.g. "Paris, France"
    languages text[], -- Array of languages spoken
    
    -- Social and web presence
    linkedin text,
    twitter text,
    website text,
    profile_image_url text,
    
    -- Professional details
    expertise text not null, -- Main area of expertise
    experience text not null, -- Years/description of experience
    key_competencies text[], -- Array of key skills/competencies
    
    -- Rating and verification
    average_rating numeric(3,2), -- Average rating out of 5
    review_count integer default 0,
    is_verified boolean default false,
    verification_date timestamp with time zone,
    
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add new columns to profiles table if they don't exist
do $$
begin
    -- Basic profile info
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'title') then
        alter table profiles add column title text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'bio') then
        alter table profiles add column bio text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'company_title') then
        alter table profiles add column company_title text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'location') then
        alter table profiles add column location text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'languages') then
        alter table profiles add column languages text[];
    end if;

    -- Social and web presence
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'twitter') then
        alter table profiles add column twitter text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'website') then
        alter table profiles add column website text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'profile_image_url') then
        alter table profiles add column profile_image_url text;
    end if;

    -- Professional details
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'key_competencies') then
        alter table profiles add column key_competencies text[];
    end if;

    -- Rating and verification
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'average_rating') then
        alter table profiles add column average_rating numeric(3,2);
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'review_count') then
        alter table profiles add column review_count integer default 0;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'is_verified') then
        alter table profiles add column is_verified boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'verification_date') then
        alter table profiles add column verification_date timestamp with time zone;
    end if;
end $$;

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies for profiles
do $$ 
begin
    -- Public viewing policy
    if not exists (
        select 1 from pg_policies 
        where tablename = 'profiles' 
        and policyname = 'Public profiles are viewable by everyone'
    ) then
        create policy "Public profiles are viewable by everyone"
            on profiles for select
            using ( true );
    end if;

    -- Signup policy
    if not exists (
        select 1 from pg_policies 
        where tablename = 'profiles' 
        and policyname = 'Anyone can insert a profile during signup'
    ) then
        create policy "Anyone can insert a profile during signup"
            on profiles for insert
            with check ( true );
    end if;

    -- Update policy
    if not exists (
        select 1 from pg_policies 
        where tablename = 'profiles' 
        and policyname = 'Users can update own profile'
    ) then
        create policy "Users can update own profile"
            on profiles for update
            using ( auth.uid() = id );
    end if;
end $$;

-- Create indexes
create index if not exists profiles_email_idx on profiles (email);
create index if not exists profiles_role_idx on profiles (role);

-- Create a table for sparks if it doesn't exist
create table if not exists sparks (
    id uuid default uuid_generate_v4() primary key,
    consultant uuid references profiles(id),
    title text not null,
    duration interval not null,
    price numeric(10,2),
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
do $$
begin
    -- Viewing policy
    if not exists (
        select 1 from pg_policies 
        where tablename = 'sparks' 
        and policyname = 'Sparks are viewable by everyone'
    ) then
        create policy "Sparks are viewable by everyone"
            on sparks for select
            using ( true );
    end if;

    -- Insert policy
    if not exists (
        select 1 from pg_policies 
        where tablename = 'sparks' 
        and policyname = 'Consultants and admins can insert sparks'
    ) then
        create policy "Consultants and admins can insert sparks"
            on sparks for insert
            with check (
                exists (
                    select 1 from profiles
                    where id = auth.uid()
                    and (role = 'consultant' or role = 'admin')
                )
                and (
                    auth.uid() = consultant
                    or exists (
                        select 1 from profiles
                        where id = auth.uid()
                        and role = 'admin'
                    )
                )
            );
    end if;

    -- Update policy
    if not exists (
        select 1 from pg_policies 
        where tablename = 'sparks' 
        and policyname = 'Consultants can update their own sparks and admins can update any spark'
    ) then
        create policy "Consultants can update their own sparks and admins can update any spark"
            on sparks for update
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
    end if;

    -- Delete policy
    if not exists (
        select 1 from pg_policies 
        where tablename = 'sparks' 
        and policyname = 'Consultants can delete their own sparks and admins can delete any spark'
    ) then
        create policy "Consultants can delete their own sparks and admins can delete any spark"
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
    end if;
end $$;

-- Create indexes
create index if not exists sparks_consultant_idx on sparks (consultant);
create index if not exists sparks_url_idx on sparks (url);

-- Create a table for consultant reviews if it doesn't exist
create table if not exists consultant_reviews (
    id uuid default uuid_generate_v4() primary key,
    consultant_id uuid references profiles(id) not null,
    reviewer_name text not null,
    reviewer_role text,
    reviewer_company text,
    review_text text not null,
    rating integer not null check (rating between 1 and 5),
    reviewer_image_url text,
    is_verified boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for consultant missions if it doesn't exist
create table if not exists consultant_missions (
    id uuid default uuid_generate_v4() primary key,
    consultant_id uuid references profiles(id) not null,
    title text not null,
    company text not null,
    description text not null,
    duration text not null,
    start_date timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add start_date column if it doesn't exist
do $$
begin
    if not exists (
        select 1 from information_schema.columns 
        where table_name = 'consultant_missions' 
        and column_name = 'start_date'
    ) then
        alter table consultant_missions add column start_date timestamp with time zone not null default now();
    end if;
end $$;

-- Enable RLS on new tables
do $$
begin
    -- Enable RLS for consultant_reviews if not already enabled
    if not exists (
        select 1 from pg_tables 
        where tablename = 'consultant_reviews' 
        and rowsecurity = true
    ) then
        alter table consultant_reviews enable row level security;
    end if;

    -- Enable RLS for consultant_missions if not already enabled
    if not exists (
        select 1 from pg_tables 
        where tablename = 'consultant_missions' 
        and rowsecurity = true
    ) then
        alter table consultant_missions enable row level security;
    end if;
end $$;

-- Create policies for consultant_reviews
do $$ 
begin
    if not exists (
        select 1 from pg_policies 
        where tablename = 'consultant_reviews' 
        and policyname = 'Public reviews are viewable by everyone'
    ) then
        create policy "Public reviews are viewable by everyone"
            on consultant_reviews for select
            using ( true );
    end if;

    if not exists (
        select 1 from pg_policies 
        where tablename = 'consultant_reviews' 
        and policyname = 'Verified clients can insert reviews'
    ) then
        create policy "Verified clients can insert reviews"
            on consultant_reviews for insert
            with check ( auth.role() = 'authenticated' );
    end if;
end $$;

-- Create policies for consultant_missions
do $$
begin
    -- Viewing policy
    if not exists (
        select 1 from pg_policies 
        where tablename = 'consultant_missions' 
        and policyname = 'Consultant missions are viewable by everyone'
    ) then
        create policy "Consultant missions are viewable by everyone"
            on consultant_missions for select
            using ( true );
    end if;

    -- Insert/Update/Delete policy
    if not exists (
        select 1 from pg_policies 
        where tablename = 'consultant_missions' 
        and policyname = 'Consultants can manage their own missions and admins can manage any mission'
    ) then
        create policy "Consultants can manage their own missions and admins can manage any mission"
            on consultant_missions for all
            using (
                (exists (
                    select 1 from profiles
                    where id = auth.uid()
                    and role = 'consultant'
                )
                and consultant_id = auth.uid())
                or
                (exists (
                    select 1 from profiles
                    where id = auth.uid()
                    and role = 'admin'
                ))
            );
    end if;
end $$;

-- Create indexes for consultant_reviews if they don't exist
do $$
begin
    if not exists (
        select 1 from pg_indexes 
        where tablename = 'consultant_reviews' 
        and indexname = 'consultant_reviews_consultant_id_idx'
    ) then
        create index consultant_reviews_consultant_id_idx on consultant_reviews (consultant_id);
    end if;
end $$;

-- Create indexes for consultant_missions if they don't exist
do $$
begin
    if not exists (
        select 1 from pg_indexes 
        where tablename = 'consultant_missions' 
        and indexname = 'consultant_missions_consultant_id_idx'
    ) then
        create index consultant_missions_consultant_id_idx on consultant_missions (consultant_id);
    end if;

    if not exists (
        select 1 from pg_indexes 
        where tablename = 'consultant_missions' 
        and indexname = 'consultant_missions_start_date_idx'
    ) and exists (
        select 1 from information_schema.columns 
        where table_name = 'consultant_missions' 
        and column_name = 'start_date'
    ) then
        create index consultant_missions_start_date_idx on consultant_missions (start_date);
    end if;
end $$;

-- Set up triggers for updated_at (moved to end after all tables exist)
do $$
begin
    -- Create the trigger function if it doesn't exist
    if not exists (select 1 from pg_proc where proname = 'handle_updated_at') then
        create function public.handle_updated_at()
        returns trigger as $trigger$
        begin
            new.updated_at = now();
            return new;
        end;
        $trigger$ language plpgsql;
    end if;

    -- Create triggers if they don't exist
    if not exists (select 1 from pg_trigger where tgname = 'handle_profiles_updated_at') then
        create trigger handle_profiles_updated_at
            before update on profiles
            for each row
            execute procedure handle_updated_at();
    end if;

    if not exists (select 1 from pg_trigger where tgname = 'handle_sparks_updated_at') then
        create trigger handle_sparks_updated_at
            before update on sparks
            for each row
            execute procedure handle_updated_at();
    end if;

    if not exists (select 1 from pg_trigger where tgname = 'handle_consultant_reviews_updated_at') then
        create trigger handle_consultant_reviews_updated_at
            before update on consultant_reviews
            for each row
            execute procedure handle_updated_at();
    end if;

    if not exists (select 1 from pg_trigger where tgname = 'handle_consultant_missions_updated_at') then
        create trigger handle_consultant_missions_updated_at
            before update on consultant_missions
            for each row
            execute procedure handle_updated_at();
    end if;
end $$; 