// firebase.js
import {initializeApp} from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
    

// Firebaseの設定情報を記述
const firebaseConfig = {
    apiKey: "AIzaSyCV4IBciDlfhlGpJ5c0DOgfAA9Mhyl4eBQ",
    authDomain: "calendar-app-b34cc.firebaseapp.com",
    projectId: "calendar-app-b34cc",
    storageBucket: "calendar-app-b34cc.firebasestorage.app",
    messagingSenderId: "931294587969",
    appId: "1:931294587969:web:eb948067e5a02bf368eac0",
    measurementId: "G-MSDHVCX32S"
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const auth = getAuth(app);

export  { database, auth };