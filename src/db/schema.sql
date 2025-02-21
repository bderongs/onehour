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
    roles user_role[] not null default '{client}',
    slug text unique,
    
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
    instagram text,
    facebook text,
    youtube text,
    medium text,
    substack text,
    website text,
    booking_url text,
    profile_image_url text,
    
    -- Professional details
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
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'slug') then
        alter table profiles add column slug text unique;
    end if;
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
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'instagram') then
        alter table profiles add column instagram text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'facebook') then
        alter table profiles add column facebook text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'youtube') then
        alter table profiles add column youtube text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'medium') then
        alter table profiles add column medium text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'substack') then
        alter table profiles add column substack text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'website') then
        alter table profiles add column website text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'booking_url') then
        alter table profiles add column booking_url text;
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

    -- Admin delete policy for consultants
    if not exists (
        select 1 from pg_policies 
        where tablename = 'profiles' 
        and policyname = 'Admins can delete consultant profiles'
    ) then
        create policy "Admins can delete consultant profiles"
            on profiles for delete
            using (
                exists (
                    select 1 from profiles
                    where id = auth.uid()
                    and roles @> array['admin']::user_role[]
                )
                and roles @> array['consultant']::user_role[]
            );
    end if;
end $$;

-- Create indexes
create index if not exists profiles_email_idx on profiles (email);
create index if not exists profiles_role_idx on profiles (roles);

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
    social_image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add social_image_url column if it doesn't exist
do $$
begin
    if not exists (
        select 1 from information_schema.columns 
        where table_name = 'sparks' 
        and column_name = 'social_image_url'
    ) then
        alter table sparks add column social_image_url text;
    end if;
end $$;

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
                    and (roles @> array['consultant'] or roles @> array['admin'])
                )
                and (
                    auth.uid() = consultant
                    or exists (
                        select 1 from profiles
                        where id = auth.uid()
                        and roles @> array['admin']
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
                    and roles @> array['consultant']
                )
                and auth.uid() = consultant)
                or
                (exists (
                    select 1 from profiles
                    where id = auth.uid()
                    and roles @> array['admin']
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
                    and roles @> array['consultant']
                )
                and auth.uid() = consultant)
                or
                (exists (
                    select 1 from profiles
                    where id = auth.uid()
                    and roles @> array['admin']
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
                    and roles @> array['consultant']
                )
                and consultant_id = auth.uid())
                or
                (exists (
                    select 1 from profiles
                    where id = auth.uid()
                    and roles @> array['admin']
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

-- Create a table for client requests if it doesn't exist
create table if not exists client_requests (
    id uuid default uuid_generate_v4() primary key,
    client_id uuid references profiles(id) not null,
    spark_id uuid references sparks(id) not null,
    status text not null default 'pending',
    message text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on client_requests
alter table client_requests enable row level security;

-- Create policies for client_requests
do $$
begin
    -- Drop existing policies if they exist
    drop policy if exists "Users can view their own requests" on client_requests;
    drop policy if exists "Users can create requests" on client_requests;
    drop policy if exists "Users can update their own requests" on client_requests;
    drop policy if exists "Authenticated users can create requests" on client_requests;

    -- Viewing policy for clients (their own requests) and consultants (requests for their sparks)
    create policy "Users can view their own requests"
        on client_requests for select
        using (
            auth.uid() = client_id
            or exists (
                select 1 from sparks
                where sparks.id = client_requests.spark_id
                and sparks.consultant = auth.uid()
            )
            or exists (
                select 1 from profiles
                where id = auth.uid()
                and roles @> array['admin']::user_role[]
            )
        );

    -- Insert policy for authenticated users and during signup
    create policy "Users can create requests"
        on client_requests for insert
        with check (
            -- Allow inserts during signup (when client_id matches the inserting user)
            client_id = auth.uid()
            -- Also allow inserts from the service role during signup
            or auth.role() = 'service_role'
        );

    -- Update policy for clients (their own requests) and consultants (requests for their sparks)
    create policy "Users can update their own requests"
        on client_requests for update
        using (
            auth.uid() = client_id
            or exists (
                select 1 from sparks
                where sparks.id = client_requests.spark_id
                and sparks.consultant = auth.uid()
            )
            or exists (
                select 1 from profiles
                where id = auth.uid()
                and roles @> array['admin']::user_role[]
            )
        );
end $$;

-- Create indexes for client_requests
create index if not exists client_requests_client_id_idx on client_requests (client_id);
create index if not exists client_requests_spark_id_idx on client_requests (spark_id);
create index if not exists client_requests_status_idx on client_requests (status);

-- Create the trigger function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
do $$
begin
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

-- Drop the old profile deletion function and trigger
drop trigger if exists on_profile_deletion on profiles;
drop function if exists public.handle_profile_deletion();

-- Create storage bucket and policies for sparks bucket
do $$
begin
    -- Create the sparks bucket if it doesn't exist
    if not exists (
        select 1 from storage.buckets 
        where id = 'sparks'
    ) then
        insert into storage.buckets (id, name, public)
        values ('sparks', 'sparks', true);
    end if;

    -- Drop existing policies if they exist
    drop policy if exists "Permettre la lecture publique des images" on storage.objects;
    drop policy if exists "Permettre l'upload aux consultants et admins" on storage.objects;
    drop policy if exists "Permettre la modification aux consultants et admins" on storage.objects;
    drop policy if exists "Permettre la suppression aux consultants et admins" on storage.objects;

    -- Create new policies
    -- Politique de lecture (SELECT) - Accessible à tous
    create policy "Permettre la lecture publique des images"
    on storage.objects for select
    using (bucket_id = 'sparks');

    -- Politique d'insertion (INSERT) - Consultants et Admins uniquement
    create policy "Permettre l'upload aux consultants et admins"
    on storage.objects for insert
    with check (
        bucket_id = 'sparks'
        and auth.role() = 'authenticated'
        and exists (
            select 1 from profiles
            where id = auth.uid()
            and (
                roles @> array['consultant']::user_role[]
                or roles @> array['admin']::user_role[]
            )
        )
    );

    -- Politique de mise à jour (UPDATE) - Consultants et Admins uniquement
    create policy "Permettre la modification aux consultants et admins"
    on storage.objects for update
    using (
        bucket_id = 'sparks'
        and auth.role() = 'authenticated'
        and exists (
            select 1 from profiles
            where id = auth.uid()
            and (
                roles @> array['consultant']::user_role[]
                or roles @> array['admin']::user_role[]
            )
        )
    );

    -- Politique de suppression (DELETE) - Consultants et Admins uniquement
    create policy "Permettre la suppression aux consultants et admins"
    on storage.objects for delete
    using (
        bucket_id = 'sparks'
        and auth.role() = 'authenticated'
        and exists (
            select 1 from profiles
            where id = auth.uid()
            and (
                roles @> array['consultant']::user_role[]
                or roles @> array['admin']::user_role[]
            )
        )
    );
end $$;

-- Function to delete a user (can only be called by admins)
create or replace function delete_user(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
    -- Check if the caller is an admin
    if not exists (
        select 1
        from profiles
        where id = auth.uid()
        and roles @> array['admin']::user_role[]
    ) then
        raise exception 'Only administrators can delete users';
    end if;

    -- Delete the auth.user (this will cascade to profiles and other related data)
    delete from auth.users where id = user_id;
end;
$$;

-- Grant execute permission on the function
grant execute on function delete_user to authenticated;