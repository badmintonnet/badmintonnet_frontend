// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC65S_YogJf9JSYSbMOoJoLjbtMAPj-KJw",
  authDomain: "badmintonnet-auth.firebaseapp.com",
  projectId: "badmintonnet-auth",
  storageBucket: "badmintonnet-auth.appspot.com",
  messagingSenderId: "887612061257",
  appId: "1:887612061257:web:b31994defefae90f6db198",
  measurementId: "G-9GKKXTF73L",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // 🔹 Firebase Auth
const provider = new GoogleAuthProvider(); // 🔹 Google Provider

export { app, auth, provider };
