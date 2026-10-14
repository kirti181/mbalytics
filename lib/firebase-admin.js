import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

function credentialConfig() {
  if (process.env.FIREBASE_PROJECT_ID) return {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };
  const file = path.join(process.cwd(), 'service-account.json');
  if (fs.existsSync(file)) return JSON.parse(fs.readFileSync(file, 'utf8'));
  throw new Error('Configure Firebase server credentials in .env.local or service-account.json');
}

let firestore;

export function getDb() {
  if (!firestore) {
    const app = getApps()[0] || initializeApp({ credential: cert(credentialConfig()) });
    firestore = getFirestore(app);
  }
  return firestore;
}
