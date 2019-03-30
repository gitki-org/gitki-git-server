import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import util from 'util';

const port = 4123;

const lazyLoadableWebServer = () => {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(httpLogger);

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