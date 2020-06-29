/// <reference path="./interface.d.ts"/>

import { Application, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as fs from 'fs';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as formData from 'express-form-data';
import { addRoutes, error } from './utils';
import { join, resolve } from 'path';
import { mkdirSync } from 'fs-extra';
// import { requestDelay } from './middlewares/requestDelay';
import userApiList from './user';
import imageApiList from './image';
import contractsApiList from './contracts';
import catalogsApiList from './catalogs';
import controlsApiList from './controls';
import deliveryApiList from './delivery';
import healthCheck from './health';
import complaintApiList from './complaint';

export type TResult = object | Array<any>;
export type TParams = {
  params: any;
  query: any;
  body: any;
  req: Request;
  res: Response;
};
export type TCallback = (params?: TParams) => Promise<TResult> | TResult;

export interface IApiList {
  url: string;
  timeout?: 'none' | 'small' | 'long';
  get?: TCallback;
  post?: TCallback;
}

try {
  mkdirSync(join(__dirname, 'tmp'));
} catch (e) {
  console.log('tmp directory is available');
}

export function makeApp(app: Application) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.raw());
  app.use(bodyParser.json());
  app.use(cookieParser());
  // app.use(requestDelay);

  app.use(
    formData.parse({
      uploadDir: join(__dirname, 'tmp'),
      autoClean: false,
    })
  );
  app.use(formData.format());
  // app.use(formData.stream());
  // app.use(formData.union());

  addRoutes(
    [
      ...userApiList,
      ...contractsApiList,
      ...controlsApiList,
      ...imageApiList,
      ...catalogsApiList,
      ...deliveryApiList,
      ...healthCheck,
      ...complaintApiList,
    ],
    app
  );
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url.includes('/api/')) {
      error(res, 404);
    } else {
      next();
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const p = resolve(__dirname, '..', '..', 'build');
    app.use(express.static(p));
    app.use((req, res) => {
      fs.createReadStream(resolve(p, 'index.html')).pipe(res);
    });
  }
}
