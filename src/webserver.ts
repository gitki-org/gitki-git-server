import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import util from 'util';

import * as apis from './apis';
import * as userApis from '@@apis/userApis';

const port = 4123;

const lazyLoadableWebServer = () => {
  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(httpLogger);

  app.post('/index', apis.index);
  app.post('/me', userApis.me);
  app.post('/newUser', userApis.newUser);
  app.post('/users', userApis.users);
  app.post('/git/commit', apis.commit);
  app.post('/git/commits', apis.commits);
  app.post('/git/repos', apis.repos);
  app.post('/git/newRepo', apis.newRepo);

  app.use(middlewareNotFound);
  app.use(errorHandler);

  const server = http.createServer(app);
  server.listen(port, () => {
    console.log('Server is listening %s', port);
  });
};

export default lazyLoadableWebServer;

function httpLogger(req: Request, res, next) {
  console.log('%s %s %s %j', new Date(), req.url, req.method, req.body);
  next();
}

function middlewareNotFound(req: Request, res, next) {
  const message = util.format('middleware is not found, %s %s', req.url, req.method);
  res.send(message);
}

function errorHandler(err, req: Request, res, next) {
  console.error(err);
  res.send('error occurred');
}
