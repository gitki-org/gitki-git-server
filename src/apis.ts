import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

import db from '@@src/db';
import FileExplorer from '@@modules/FileExplorer';
import Git from '@@modules/Git';
import paths from '@@src/paths';
import * as utils from '@@utils/utils';

export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const { orgName, repoName } = req.body;

    const contents = await FileExplorer.openIndex(orgName, repoName);
    res.send({
      contents,
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

      const gitRepo = await Git.commit({
        commitMsg: 'Initial commit',
        orgName,
        repoName,
      });

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
    const query = orgName ? reposRef.where('orgName', '==', orgName) : reposRef;
    const result = await query.get();

    const repos = result.docs.map((d) => {
      return d.data() && d.data();
    });

    res.send({
      repos,
    });
  } catch (err) {
    throw err;
  }
}

export async function commit(req: Request, res: Response, next) {
  try {
    const { 
      commitMsg,
      contents, 
      orgName, 
      repoName,
    } = req.body;
    
    await FileExplorer.editIndex({
      contents,
      orgName,
      repoName,
    });

    const msg = await Git.commit({
      commitMsg,
      orgName,
      repoName,
    });

    res.send({
      msg,
    });
  } catch (err) {
    throw err;
  }
}

export async function commits(req: Request, res: Response, next) {
  try {
    const { orgName, repoName } = req.body;
    const repoHash = utils.hash(`${orgName}-${repoName}`);

    const commits = await Git.log(orgName, repoName, repoHash);
    
    res.send({
      commits: commits.all,
    });
  } catch (err) {
    throw err;
  }
}
