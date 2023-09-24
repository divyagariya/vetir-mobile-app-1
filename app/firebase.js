import {initializeApp, getApp} from 'firebase/app';
import {initializeFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyA0mcU5B7BIJ4_XNfv5Gc7Q8ra7TULZmoU',
  authDomain: 'vetir-112233.firebaseapp.com',
  projectId: 'vetir-112233',
  storageBucket: 'vetir-112233.appspot.com',
  messagingSenderId: '185367964920',
  appId: '1:185367964920:ios:d4bf19861684b03d795f0d',
  measurementId: 'G-NZ8K8PP3KD"', // optional
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = initializeFirestore(app, {experimentalForceLongPolling: true});

export {db, auth};
