import Firestore from '@google-cloud/firestore';
import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

import FileExplorer from '@@modules/FileExplorer';
import Git from '@@modules/Git';
import paths from '@@src/paths';
import * as utils from '@@utils/utils';

const db = new (Firestore as any)();

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const { orgName, repoName } = req.body;
    const repoHash = utils.hash(`${orgName}-${repoName}`);

    const contents = await FileExplorer.openIndex(orgName, repoName, repoHash);
    res.send({
      contents,
    });
  } catch (err) {
    throw err;
  }
}

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

      const gitRepo = await Git.makeGitRepo(orgName, repoName, repoHash);

      return {
        gitRepo,
        orgRef,
      };
    });

    res.send({
      gitRepo: dbResult.gitRepo,
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

export async function commits(req: Request, res: Response, next) {
  try {
    const { orgName, repoName } = req.body;
    const repoHash = utils.hash(`${orgName}-${repoName}`);

    const commits = await Git.getCommits(orgName, repoName, repoHash);
    
    res.send({
      commits: commits.all,
    });
  } catch (err) {
    throw err;
  }
}
