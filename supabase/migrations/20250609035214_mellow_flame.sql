/*
  # Create users table and authentication setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique, not null)
      - `name` (text, nullable)
      - `phone` (text, nullable)
      - `isAdmin` (boolean, default false)
      - `isActive` (boolean, default true)
      - `created_at` (timestamp, default now())
      - `lastLogin` (timestamp, nullable)
      - `profile` (jsonb, nullable)

  2. Security
    - Enable RLS on `users` table
    - Add policies for authenticated users to manage their own data
    - Add policy for users to read other users' basic info (for admin functionality)

  3. Functions & Triggers
    - Create function to handle new user creation
    - Add trigger to automatically create user profile when auth user is created
*/

-- Create the users table
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text,
  phone text,
  isAdmin boolean NOT NULL DEFAULT false,
  isActive boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  lastLogin timestamptz,
  profile jsonb
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for the users table
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to read basic info of other users (needed for admin functionality)
CREATE POLICY "Users can view basic info of other users"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', '')
  );
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Could not create user profile: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_isActive ON public.users(isActive);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);