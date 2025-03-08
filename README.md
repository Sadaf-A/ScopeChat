# ScopeChat

A modern, real-time chat application built with Next.js, Supabase, and Tailwind CSS.



https://github.com/user-attachments/assets/5f04f573-e82d-49ef-b971-a9824acd7c6e



## Features

- **Real-time messaging** using Supabase's real-time subscriptions
- **User authentication** and management
- **Modern UI** with dark mode and responsive design
- **User search** functionality
- **File attachments** support
- **Emoji picker** for expressive communication
- **AI assistance** for smart replies
- **Voice messaging** capabilities

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase (authentication, database, real-time)
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **Routing**: Next.js App Router

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Sadaf-A/scopechat.git
   cd scopechat
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase:
   - Create a new Supabase project
   - Set up the database tables (see Database Schema section below)
   - Enable real-time subscriptions for the `messages` table

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Tables

#### auth.users (managed by Supabase Auth)
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| email | varchar | User's email address |
| created_at | timestamp | When the user was created |
| updated_at | timestamp | When the user was last updated |

#### public.chats
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| sender_id | uuid | Foreign key to auth.users |
| receiver_id | uuid | Foreign key to auth.users |
| created_at | timestamp | When the chat was created |

#### public.messages
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| chat_id | uuid | Foreign key to public.chats |
| sender_id | uuid | Foreign key to auth.users |
| content | text | Message content |
| created_at | timestamp | When the message was sent |
| attachment_url | text | Optional URL to an attached file |

### RLS (Row Level Security) Policies

Set up the following RLS policies to secure your data:

#### Chats Table
```sql
-- Allow users to select chats they're part of
CREATE POLICY "Users can view their own chats" ON public.chats
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Allow users to insert chats where they are the sender
CREATE POLICY "Users can create chats" ON public.chats
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
```

#### Messages Table
```sql
-- Allow users to select messages from chats they're part of
CREATE POLICY "Users can view messages in their chats" ON public.messages
  FOR SELECT USING (
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE sender_id = auth.uid() OR receiver_id = auth.uid()
    )
  );

-- Allow users to insert messages in chats they're part of
CREATE POLICY "Users can send messages to their chats" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    chat_id IN (
      SELECT id FROM public.chats 
      WHERE sender_id = auth.uid() OR receiver_id = auth.uid()
    )
  );
```

### Set Up Real-time Subscriptions

Enable real-time functionality for the `messages` table in your Supabase dashboard:

1. Go to Database → Replication
2. Enable replication for the `messages` table
3. Set the "Source" to "All changes"

## Project Structure

```
ScopeChat/
├── app/                  # Next.js app directory
│   ├── auth/             # Authentication pages
│   ├── components/       # Shared components
│   ├── lib/              # Utility functions and libraries
│   │   └── supabase.ts   # Supabase client configuration
│   └── layout.tsx        # Main layout component
├── components/           # UI components
│   └── ui/               # UI components from shadcn/ui
├── public/               # Static assets
└── styles/               # Global CSS styles
```

## API Routes

### Authentication
- `/auth/sign-up` - Register a new user
- `/auth/sign-in` - Sign in an existing user
- `/auth/sign-out` - Sign out the current user

### Chats
- `/api/chats` - Create or list chats
- `/api/chats/:id` - Get, update or delete a specific chat

### Messages
- `/api/messages` - Send a new message
- `/api/messages/:chat_id` - Get messages for a specific chat

## Deployment

Deploy the application to Vercel:

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Set the environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- [Supabase](https://supabase.io/) for the backend infrastructure
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons
- [shadcn/ui](https://ui.shadcn.com/) for UI components
