import Firestore from '@google-cloud/firestore';
import { Request, Response, NextFunction } from 'express';

const db = new (Firestore as any)();

export async function getMe(req: Request, res: Response, next) {
  try {
    const { username } = req.body;

    const users = db.collection('users');
    const doc = users.doc(username);
    console.log('doc: %o', doc);

    res.send({
      ...doc.get(),
    });
  } catch (err) {
    throw err;
  }
}

export async function setUser(req: Request, res: Response, next) {
  try {
    const { username } = req.body;

    const users = db.collection('users');
    const doc = users.doc(username);
    
    await doc.set({
      username,
    });

    const result = await doc.get();

    res.send({
      ...result.data(),
    });
  } catch (err) {
    throw err;
  }
}
