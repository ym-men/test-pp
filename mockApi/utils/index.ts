import { Response, Request, Application } from 'express';
import { IApiList, TCallback } from '../mocks';

const AuthHeader = 'authorization';

export class RequestError extends Error {
  public readonly status: number;
  public readonly ok: boolean;

  constructor(status: number) {
    super(getStatusMessage(status));
    this.ok = status === 200;
    this.status = status;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RequestError.prototype);
  }
}

export function error(res: Response, status: number): void {
  res.status(status);
  res.json({ message: new RequestError(status).message });
}

function getStatusMessage(status: number): string {
  switch (status) {
    case 404:
      return 'Not found';
    case 400:
      return 'Bad request';
    case 401:
      return 'Unauthorized';
    case 200:
      return 'Ok';
    default:
      return '';
  }
}

export function randomInteger(min: number, max: number): number {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

export function getToken(req: Request): string | null {
  const token: string | undefined = req.headers[AuthHeader] as string | undefined;
  return (token && token.replace('Basic ', '') && token.replace('Bearer ', '')) || null;
}

export function isApi(req: Request): boolean {
  return req.url.includes('/api/');
}

export const wrapHandler = (callback: TCallback, timeoutMode?: 'none' | 'small' | 'long') => (
  req: Request,
  res: Response
) => {
  timeoutMode = timeoutMode || 'small';

  const urlParams = req.params || Object.create(null);
  const getParams = req.query || Object.create(null);
  const body = req.body;
  const start = Date.now();

  const applyError = (e: Error) => {
    if (e instanceof RequestError) {
      res.status(e.status);
    } else {
      res.status(500);
    }
    res.json({ message: e.message });
  };

  const isJsonLike = (some: any) => {
    if (typeof some !== 'object') {
      return false;
    }
    if (Array.isArray(some)) {
      return true;
    }
    return some.constructor === Object;
  };

  const applyTimeout = (cb: any) => {
    const makeProxy = (min: number, max: number, func: any) => {
      const timeout = randomInteger(min, max);
      return (...args: Array<any>) => {
        const delta = timeout - (Date.now() - start);
        if (delta < 0) {
          return func(...args);
        } else {
          setTimeout(() => {
            func(...args);
          }, delta);
        }
      };
    };

    switch (timeoutMode) {
      case 'none':
        return cb;
      case 'small':
        return makeProxy(15, 300, cb);
      case 'long':
        return makeProxy(1500, 5000, cb);
    }
  };

  const applyResult = (data: any) => {
    if (isJsonLike(data)) {
      res.json(data);
    } else {
      res.end(data);
    }
  };

  try {
    const result = callback({ params: urlParams, query: getParams, body, req, res });
    if (result && 'then' in result && typeof result.then === 'function') {
      result.then(applyTimeout(applyResult), applyError);
    } else {
      applyResult(result);
    }
  } catch (e) {
    applyError(e);
  }
};

export const addRoutes = (list: Array<IApiList>, app: Application) => {
  list.forEach(item => {
    if (item.get) {
      app.get(item.url, wrapHandler(item.get));
    }
    if (item.post) {
      app.post(item.url, wrapHandler(item.post));
    }
  });
};

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

export function guid(): string {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function id4(): string {
  return s4();
}
