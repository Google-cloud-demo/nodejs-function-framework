import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp({
    // credential: credential.cert(`${__dirname}/firebase-service-account.json`)
    credential: credential.applicationDefault(),
    
});

const auth = getAuth(app);

const firestore = getFirestore(app);
export {
    auth,
    firestore,
};
