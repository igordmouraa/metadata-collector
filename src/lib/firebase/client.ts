import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    addDoc,
    Firestore,
    serverTimestamp,
    setLogLevel
} from 'firebase/firestore';

// Ativa logs detalhados do Firebase (opcional)
setLogLevel('debug');

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp;
let db: Firestore;

export const initializeFirebase = () => {
    if (!getApps().length) {
        console.log('🔥 Initializing Firebase...');
        try {
            app = initializeApp(firebaseConfig);
            db = getFirestore(app);
            console.log('✅ Firebase initialized successfully!');
        } catch (error) {
            console.error('❌ Failed to initialize Firebase:', error);
            throw error;
        }
    }
    return db;
};

export const getFirestoreInstance = (): Firestore => {
    if (!db) {
        throw new Error('Firestore not initialized. Call initializeFirebase() first.');
    }
    return db;
};

export const getDeviceCollection = () => {
    return collection(getFirestoreInstance(), 'deviceAnalytics');
};

// Função para remover campos undefined
const sanitizeData = (data: any): any => {
    if (typeof data !== 'object' || data === null) return data;

    if (Array.isArray(data)) {
        return data.map(sanitizeData).filter(item => item !== undefined);
    }

    return Object.fromEntries(
        Object.entries(data)
            .map(([key, value]) => [key, sanitizeData(value)])
            .filter(([_, value]) => value !== undefined)
    );
};

export const sendDeviceDataToFirebase = async (data: any) => {
    try {
        const db = getFirestoreInstance();
        const collectionRef = getDeviceCollection();

        // Sanitiza os dados antes de enviar
        const sanitizedData = sanitizeData({
            ...data,
            timestamp: serverTimestamp() // Usa timestamp do servidor
        });

        console.log('Sanitized data:', sanitizedData);

        const docRef = await addDoc(collectionRef, sanitizedData);
        console.log('Document written with ID:', docRef.id);
        return true;
    } catch (error) {
        console.error('Error sending data to Firebase:', error);
        return false;
    }
};

// Inicialização automática
try {
    initializeFirebase();
} catch (error) {
    console.error('Failed to initialize Firebase:', error);
}