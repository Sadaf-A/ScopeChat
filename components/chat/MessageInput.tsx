"use client";

import { RefObject } from 'react';
import {
  Send, Paperclip, Smile, Mic, Clock, RotateCw, FileText, Sparkles, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handleAttachClick: () => void;
  removeSelectedFile: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  handleEmojiClick: (emoji: string) => void;
}

export default function MessageInput({
  newMessage,
  setNewMessage,
  onSendMessage,
  selectedFile,
  fileInputRef,
  handleAttachClick,
  removeSelectedFile,
  showEmojiPicker,
  setShowEmojiPicker
}: MessageInputProps) {
  return (
    <footer className="bg-gray-950 p-3 border-t border-gray-800">
      {/* Message input and send button on top */}
      <form 
        className="flex items-center gap-2 mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSendMessage();
        }}
        aria-label="Message form"
      >
        <div className="flex-1 bg-gray-800 rounded-full flex items-center px-3 py-0.5">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-gray-100 placeholder:text-gray-500 h-8 px-0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
            aria-label="Message input"
          />
        </div>
        
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className={`${newMessage.trim() || selectedFile ? 'text-emerald-500 hover:bg-emerald-900 hover:bg-opacity-50' : 'text-gray-400 hover:text-emerald-500 hover:bg-gray-800'} transition-colors rounded-full h-10 w-10`}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
        </Button>
      </form>

      {/* Selected file display */}
      {selectedFile && (
        <div className="mb-2 bg-gray-800 rounded-lg p-2 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Paperclip className="h-4 w-4 mr-2 text-emerald-400" aria-hidden="true" />
            <span className="truncate max-w-md">{selectedFile.name}</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 rounded-full hover:bg-gray-700" 
            onClick={removeSelectedFile}
            aria-label="Remove file"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </Button>
        </div>
      )}

      {/* Icons below */}
      <div className="flex items-center gap-2" role="toolbar" aria-label="Message options">
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              removeSelectedFile();
            }
          }}
          aria-hidden="true"
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-emerald-500 hover:bg-gray-800 transition-colors rounded-full h-10 w-10"
          onClick={handleAttachClick}
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" aria-hidden="true" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-emerald-500 hover:bg-gray-800 transition-colors rounded-full h-10 w-10"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          aria-label="Emoji picker"
        >
          <Smile className="h-5 w-5" aria-hidden="true" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-emerald-500 hover:bg-gray-800 transition-colors rounded-full h-10 w-10"
          aria-label="AI suggestions"
        >
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-emerald-500 hover:bg-gray-800 transition-colors rounded-full h-10 w-10"
          aria-label="Voice message"
        >
          <Mic className="h-5 w-5" aria-hidden="true" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-emerald-500 hover:bg-gray-800 transition-colors rounded-full h-10 w-10"
          aria-label="Schedule message"
        >
          <Clock className="h-5 w-5" aria-hidden="true" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-emerald-500 hover:bg-gray-800 transition-colors rounded-full h-10 w-10"
          aria-label="Refresh"
        >
          <RotateCw className="h-5 w-5" aria-hidden="true" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-gray-400 hover:text-emerald-500 hover:bg-gray-800 transition-colors rounded-full h-10 w-10"
          aria-label="Template messages"
        >
          <FileText className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </footer>
  );
}