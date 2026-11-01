import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './config';

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_health', 'status'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client offline, falling back to local offline cache.');
      return false;
    }
    // Any permission or missing doc error still means the server responded!
    return true;
  }
}
