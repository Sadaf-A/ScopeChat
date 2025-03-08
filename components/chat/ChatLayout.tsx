// Import necessary modules and components
"use client";

import { useEffect, useState, useRef } from 'react';
import {
    Search, MoreVertical, Phone, VideoIcon, Send, Paperclip,
    Smile, Mic, Home, MessageSquare, BarChart2, Users, Settings,
    Bell, RefreshCw, HelpCircle, Share2, Filter, Save, X,
    Headphones, Ticket, List, Megaphone, GitBranch, CreditCard, Image, CheckSquare, Clock, RotateCw, FileText, Sparkles
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';

export default function ChatLayout() {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (!selectedChat) return;
  
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("chat_id", selectedChat.id)
        .order("created_at", { ascending: true });
  
      if (error) {
        console.error("❌ Error fetching messages:", error);
        return;
      }
  
      console.log("✅ Messages loaded:", data);
      setMessages(data);
    };
  
    fetchMessages();
  
    // 🔥 Set up real-time listener for new messages
    const messageSubscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${selectedChat.id}` },
        (payload) => {
          console.log("📩 New message received:", payload.new);
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(messageSubscription); // Clean up the subscription
    };
  }, [selectedChat]);
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("❌ Error fetching current user:", error);
        return;
      }
      setCurrentUser(data.user); // ✅ Store logged-in user
    };
  
    fetchUser();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleSendMessage = async () => {
    const currentUser = (await supabase.auth.getUser()).data.user;
    if (!newMessage.trim() || !selectedChat || !currentUser) return;
  
    const { data, error } = await supabase
      .from("messages")
      .insert([{ chat_id: selectedChat.id, sender_id: currentUser.id, content: newMessage }])
      .select()
      .single();
  
    if (error) {
      console.error("❌ Error sending message:", error);
      return;
    }
  
    console.log("✅ Message sent:", data);
  
    // Clear the input field
    setNewMessage("");
  };
  
  
  const handleChatSelect = async (receiver: any) => {
    const current_user = (await supabase.auth.getUser()).data.user;
    if (!current_user) {
      console.error("❌ No authenticated user found!");
      return;
    }
  
    console.log(`🖱 Clicking on user: ${receiver.email} (ID: ${receiver.id})`);
  
    // 🔥 Check if a chat already exists
    let { data: existingChats, error: chatError } = await supabase
      .from("chats")
      .select("*")
      .or(
        `sender_id.eq.${current_user.id},receiver_id.eq.${receiver.id},sender_id.eq.${receiver.id},receiver_id.eq.${current_user.id}`
      );
  
    if (chatError) {
      console.error("❌ Error checking existing chats:", chatError);
      return;
    }
  
    console.log("🔍 Existing Chats:", existingChats);
  
    if (existingChats.length > 0) {
      console.log("✅ Chat already exists, opening chat...");
      setSelectedChat(existingChats[0]);
      return;
    }
  
    // 🔥 If no chat exists, create a new one
    console.log("🆕 Creating new chat...");
    const { data: newChat, error: insertError } = await supabase
      .from("chats")
      .insert([{ sender_id: current_user.id, receiver_id: receiver.id }])
      .select()
      .single();
  
    if (insertError) {
      console.error("❌ Error creating chat:", insertError);
      return;
    }
  
    console.log("✅ New chat created:", newChat);
    setSelectedChat(newChat);
  };  

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
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

  const fetchAvailableUsers = async () => {
    // 🔹 Fetch the currently logged-in user
    const { data: authUser, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser?.user) {
      console.error("Error fetching current user:", authError);
      return;
    }
  
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }
  
    const filteredUsers = data.users.filter((user : any) => user?.id !== authUser.user.id);
  
    setUsers(filteredUsers);
    setFilteredUsers(filteredUsers); // Initialize filtered users with all users
  };
  
  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  return (
    <main className="flex h-screen bg-gray-900 text-gray-100">
      {/* Navigation Sidebar */}
      <nav className="w-[60px] bg-gray-950 border-r border-gray-800 flex flex-col items-center py-4" aria-label="Primary navigation">
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 relative" title="Support">
          <Headphones className="h-5 w-5 text-emerald-500" aria-hidden="true" />
          <span className="absolute top-0 right-0 bg-emerald-500 text-xs font-medium text-white rounded-full w-4 h-4 flex items-center justify-center -mt-1 -mr-1" aria-label="12 notifications">12</span>
        </div>
        <div className="nav-item p-3 rounded-md bg-gray-800 mb-5 transition-colors" title="Home">
          <Home className="h-5 w-5 text-gray-100" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 transition-colors" title="Messages">
          <MessageSquare className="h-5 w-5 text-emerald-500" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 transition-colors" title="Tickets">
          <Ticket className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 transition-colors" title="Analytics">
          <BarChart2 className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 transition-colors" title="Lists">
          <List className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 transition-colors" title="Announcements">
          <Megaphone className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 transition-colors" title="Version control">
          <GitBranch className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 transition-colors" title="Billing">
          <CreditCard className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 transition-colors" title="Media">
          <Image className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 mb-5 transition-colors" title="Tasks">
          <CheckSquare className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <div className="nav-item p-3 rounded-md hover:bg-gray-800 transition-colors mt-auto" title="Settings">
          <Settings className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
      </nav>

      {/* Chat List Sidebar */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search users"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
          </div>
        </div>
        
        {/* User List */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent" aria-label="User list">
          {filteredUsers.length === 0 ? (
            <p className="text-gray-400 text-center mt-4">No users available</p>
          ) : (
            filteredUsers.map((user) => (
              <article
                key={user.id}
                className="px-3 py-2 hover:bg-gray-800 cursor-pointer transition-colors"
                onClick={() => handleChatSelect(user)}
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

      {/* Main chat area */}
      <section className="flex-1 flex flex-col bg-gray-900" aria-label="Chat conversation">
        {/* Chat header */}
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
        <footer className="bg-gray-950 p-3 border-t border-gray-800">
          {/* Message input and send button on top */}
          <form 
            className="flex items-center gap-2 mb-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
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
                    handleSendMessage();
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
              onChange={handleFileChange}
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
      </section>
    </main>
  );
}