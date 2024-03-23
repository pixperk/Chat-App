
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA7Ljs12ygESuvengrNbaHGOs_LiN7t4hQ",
  authDomain: "chat-d8ee2.firebaseapp.com",
  projectId: "chat-d8ee2",
  storageBucket: "chat-d8ee2.appspot.com",
  messagingSenderId: "672688404248",
  appId: "1:672688404248:web:5e4d856d464ca6587e906d",
  measurementId: "G-2GZJ4WGB3W"
};


export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);