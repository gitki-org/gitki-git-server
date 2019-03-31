import Firestore from '@google-cloud/firestore';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

import db from '@@src/db';
import FileExplorer from '@@modules/FileExplorer';
import Git from '@@modules/Git';
import paths from '@@src/paths';
import * as utils from '@@utils/utils';

export async function me(req: Request, res: Response, next) {
  try {
    const { username } = req.body;

    const users = db.collection('orgs');
    const doc = users.doc(username);
    console.log('doc: %o', doc);

    res.send({
      ...doc.get(),
    });
  } catch (err) {
    throw err;
  }
}

export async function newUser(req: Request, res: Response, next) {
  try {
    const { username } = req.body;

    const doc = db.collection('orgs')
      .doc(username);
    
    await doc.set({
      username,
    });

    const result = await doc.get();
    console.log('db written', result);

    res.send({
      msg: 'new user is successfully created',
      ...result.data(),
    });
  } catch (err) {
    throw err;
  }
}

export async function users(req: Request, res: Response, next) {
  try {
    const usersSnapshot = await db.collection('orgs').get();
    const users = usersSnapshot.docs.map((user) => {
      return user.data();
    });

    res.send({
      users,
    });
  } catch (err) {
    throw err;
  }
}