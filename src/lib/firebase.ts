import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyClIFxBc4U9QuLctbHrqCJPoGi9UmqeNi8",
	authDomain: "allthecart-ebdb8.firebaseapp.com",
	projectId: "allthecart-ebdb8",
	storageBucket: "allthecart-ebdb8.firebasestorage.app",
	messagingSenderId: "796639235238",
	appId: "1:796639235238:web:ea5146cdbb4dd40e4ef867",
};

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
