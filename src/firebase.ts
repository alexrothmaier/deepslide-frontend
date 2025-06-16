// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import firebaseConfig from './firebaseConfig.ts';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
