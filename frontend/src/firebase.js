import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBE9Xp-iYbxi_s2d7yX3g_4Gzed9eAIc1E",
    authDomain: "ajaia-doc-editor.firebaseapp.com",
    projectId: "ajaia-doc-editor",
    storageBucket: "ajaia-doc-editor.firebasestorage.app",
    messagingSenderId: "735926681890",
    appId: "1:735926681890:web:376543588f7fb7d49aa57b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);