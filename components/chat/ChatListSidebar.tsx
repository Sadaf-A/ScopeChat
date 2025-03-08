"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';

interface ChatListSidebarProps {
  users: any[];
  allUsers: any[];
  setFilteredUsers: (users: any[]) => void;
  onChatSelect: (user: any) => void;
}

export default function ChatListSidebar({ users, allUsers, setFilteredUsers, onChatSelect }: ChatListSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user => 
        user.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  return (
    <aside className="w-[320px] bg-gray-900 flex flex-col border-r border-gray-800" aria-label="Chat users">
      {/* Header */}
      <header className="h-[60px] bg-gray-950 flex items-center px-4 justify-between">
        <h2 className="text-sm font-medium text-emerald-500">Users</h2>
      </header>
      
      {/* Search */}
      <div className="p-2 bg-gray-900">
        <div className="relative">
          <Input
            placeholder="Search"
            className="pl-10 bg-gray-800 border-0 text-gray-300 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-emerald-500 rounded-full h-9"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search users"
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
        </div>
      </div>
      
      {/* User List */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent" aria-label="User list">
        {users.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No users available</p>
        ) : (
          users.map((user) => (
            <article
              key={user.id}
              className="px-3 py-2 hover:bg-gray-800 cursor-pointer transition-colors"
              onClick={() => onChatSelect(user)}
              role="button"
              tabIndex={0}
              aria-label={`Chat with ${user.email}`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-1 ring-gray-700" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-100 truncate text-sm">{user.email}</h3>
                </div>
              </div>
            </article>
          ))
        )}
      </nav>
    </aside>
  );
}