"use client";
import { Search, MoreVertical, Phone, VideoIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function ChatHeader() {
  return (
    <header className="h-[60px] bg-gray-950 flex items-center px-4 justify-between border-b border-gray-800">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 ring-1 ring-gray-700" />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-gray-100">Test El Centro</h2>
            <span className="text-xs bg-gray-700 text-emerald-400 rounded-full px-2 py-0.5">CVFER</span>
          </div>
          <p className="text-xs text-gray-400 truncate max-w-md">Roshnag Airtel, Roshnag JD, Bharat Kumar Ramesh, Periskope</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-400">
        <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-emerald-500 transition-colors rounded-full h-8 w-8" aria-label="Video call">
          <VideoIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-emerald-500 transition-colors rounded-full h-8 w-8" aria-label="Phone call">
          <Phone className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-emerald-500 transition-colors rounded-full h-8 w-8" aria-label="Search in conversation">
          <Search className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" className="hover:bg-gray-800 hover:text-emerald-500 transition-colors rounded-full h-8 w-8" aria-label="More options">
          <MoreVertical className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}