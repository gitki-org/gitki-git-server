import Firestore from '@google-cloud/firestore';
import fs from 'fs';
import nodegit from 'nodegit';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

import paths from '@@src/paths';
import * as utils from '@@utils/utils';

const db = new (Firestore as any)();

export async function getMe(req: Request, res: Response, next) {
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

export async function newRepo(req: Request, res: Response, next) {
  try {
    const { orgName = 'temp', repoName = 'temp' } = req.body;
    const repoHash = utils.hash(`${orgName}-${repoName}`);
    
    const dbResult = await db.runTransaction(async (t) => {
      const orgRef = db.collection('orgs')
        .doc(orgName);

      const org = await t.get(orgRef);
      if (!org.exists) {
        throw new Error('Org does not exists');
      }

      const repo = db.collection('repos')
        .doc(repoHash);

      const op1 = await t.set(repo, {
        orgName,
        orgRef,
        repoName,
      });

      const gitRepo = makeGitRepo(orgName, repoName, repoHash);

      return {
        orgRef,
      };
    });

    res.send({
      msg: 'repo is successfully created',
      orgName,
      orgRef: dbResult.orgRef.path,
      repoName,
      repoHash,
    });
  } catch (err) {
    throw err;
  }
}

export async function repos(req: Request, res: Response, next) {
  try {
    const { orgName } = req.body;
    const reposRef = db.collection('repos');
    const query = reposRef.where('orgName', '==', orgName);
    const result = await query.get();

    const repos = result.docs.map((d) => {
      return d.data() && d.data().repoName;
    });

    res.send({
      repos,
    });
  } catch (err) {
    throw err;
  }
}

async function makeGitRepo(orgName, repoName, repoHash) {
  const pathToRepo = path.resolve(paths.gitStorage, orgName, repoHash);
  const pathToDoc = path.resolve(pathToRepo, 'doc');
  
  try {
    await nodegit.Repository.init(pathToRepo, 0);
    fs.mkdirSync(pathToDoc, { recursive: true });
    fs.writeFileSync(path.resolve(pathToDoc, 'index.md'), repoName, {
      flag: 'wx',
    });

    return 1;
  } catch (err) {
    throw err;
  }
}
