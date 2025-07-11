import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARM2kPuAtw9F6sQtHX4eUoLlerwjJaB-4",
  authDomain: "demoproject-f19ef.firebaseapp.com",
  projectId: "demoproject-f19ef",
  storageBucket: "demoproject-f19ef.appspot.com",
  messagingSenderId: "26014209242",
  appId: "1:26014209242:web:01e171eb021abd6a2981e3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Export the auth instance and provider
export { auth, googleProvider }; 