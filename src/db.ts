import Firestore from '@google-cloud/firestore';

const db = new (Firestore as any)();

export default db;
