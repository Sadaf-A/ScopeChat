"use client";

import { useState, useRef } from 'react';
import { format } from 'date-fns';
import {
  Search, MoreVertical, Phone, VideoIcon, Send, Paperclip,
  Smile, Mic, Clock, RotateCw, FileText, Sparkles, X, MessageSquare
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput';

interface ChatMainAreaProps {
  selectedChat: any;
  messages: any[];
  currentUser: any;
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
}

export default function ChatMainArea({ 
  selectedChat, 
  messages, 
  currentUser, 
  newMessage, 
  setNewMessage, 
  onSendMessage 
}: ChatMainAreaProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(newMessage + emoji); // Directly update the state
    setShowEmojiPicker(false);
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <section className="flex-1 flex flex-col bg-gray-900" aria-label="Chat conversation">
      <ChatHeader />

      {/* Chat messages */}
      <main className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent bg-gray-950 bg-opacity-90 bg-[url('/subtle-dark-pattern.png')]" role="log" aria-label="Chat messages">
        {selectedChat && messages.length > 0 ? (
          messages.map((msg: any, index: number, array: any[]) => {
            const isCurrentUser = msg.sender_id === currentUser?.id; 

            return (
              <article key={msg.id} className={`mt-3 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`relative px-3 py-2 rounded-2xl max-w-[70%] shadow-sm 
                    ${isCurrentUser ? "bg-emerald-700 text-gray-100" : "bg-gray-800 text-gray-100"}`}
                  role="article"
                  aria-label={`Message from ${isCurrentUser ? 'you' : msg.sender_name || 'other user'}`}
                >
                  {/* Show sender name only for received messages */}
                  {!isCurrentUser && (index === 0 || array[index - 1].sender_id !== msg.sender_id) && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-xs text-emerald-400">{msg.sender_name || ""}</span>
                    </div>
                  )}

                  <p className="text-sm leading-tight">{msg.content}</p>

                  <time 
                    className="text-[10px] text-gray-300 text-right mt-1 opacity-70"
                    dateTime={msg.created_at}
                  >
                    {format(new Date(msg.created_at), "HH:mm")}
                  </time>
                </div>
              </article>
            );
          })
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 bg-gray-800 p-6 rounded-xl shadow-lg">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-emerald-500 opacity-50" aria-hidden="true" />
              <p className="text-gray-400">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </main>

      {/* Message input area */}
      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={onSendMessage}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        fileInputRef={fileInputRef}
        handleAttachClick={handleAttachClick}
        removeSelectedFile={removeSelectedFile}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        handleEmojiClick={handleEmojiClick}
      />
    </section>
  );
}