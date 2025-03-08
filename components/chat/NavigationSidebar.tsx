"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import NavigationSidebar from './NavigationSidebar';
import ChatListSidebar from './ChatListSidebar';
import ChatMainArea from './ChatMainArea';

export default function ChatLayout() {
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState("");

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

  return (
    <main className="flex h-screen bg-gray-900 text-gray-100">
      <NavigationSidebar />
      
      <ChatListSidebar 
        users={filteredUsers}
        setFilteredUsers={setFilteredUsers}
        allUsers={users} 
        onChatSelect={handleChatSelect}
      />
      
      <ChatMainArea 
        selectedChat={selectedChat}
        messages={messages}
        currentUser={currentUser}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
      />
    </main>
  );
}