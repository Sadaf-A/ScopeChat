import { openDB } from 'idb';

export async function initDB() {
  const db = await openDB('chat-app', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('messages')) {
        db.createObjectStore('messages', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('chats')) {
        db.createObjectStore('chats', { keyPath: 'id' });
      }
    },
  });
  return db;
}

export async function saveMessage(message: any) {
  const db = await initDB();
  await db.put('messages', message);
}

export async function saveChat(chat: any) {
  const db = await initDB();
  await db.put('chats', chat);
}