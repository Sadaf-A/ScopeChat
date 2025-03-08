/*
  # Create chat application schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `username` (text)
      - `avatar_url` (text)
      - `updated_at` (timestamp)
    
    - `chats`
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_participants`
      - `chat_id` (uuid, foreign key)
      - `profile_id` (uuid, foreign key)
      - `joined_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, foreign key)
      - `profile_id` (uuid, foreign key)
      - `content` (text)
      - `created_at` (timestamp)
    
    - `chat_labels`
      - `id` (uuid, primary key)
      - `name` (text)
      - `color` (text)
    
    - `chat_label_assignments`
      - `chat_id` (uuid, foreign key)
      - `label_id` (uuid, foreign key)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  avatar_url text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (id)
);

-- Create chats table
CREATE TABLE chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create chat participants table
CREATE TABLE chat_participants (
  chat_id uuid REFERENCES chats ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (chat_id, profile_id)
);

-- Create messages table
CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid REFERENCES chats ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create chat labels table
CREATE TABLE chat_labels (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  color text NOT NULL
);

-- Create chat label assignments table
CREATE TABLE chat_label_assignments (
  chat_id uuid REFERENCES chats ON DELETE CASCADE,
  label_id uuid REFERENCES chat_labels ON DELETE CASCADE,
  PRIMARY KEY (chat_id, label_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_label_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read chats they participate in"
  ON chats FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.chat_id = chats.id
      AND chat_participants.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can read messages in their chats"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.chat_id = messages.chat_id
      AND chat_participants.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their chats"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.chat_id = messages.chat_id
      AND chat_participants.profile_id = auth.uid()
    )
  );

CREATE POLICY "Users can read chat labels"
  ON chat_labels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read label assignments for their chats"
  ON chat_label_assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_participants.chat_id = chat_label_assignments.chat_id
      AND chat_participants.profile_id = auth.uid()
    )
  );