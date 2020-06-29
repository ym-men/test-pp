import { Request, Response, NextFunction } from 'express-serve-static-core';

export const requestDelay = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    next();
  } else {
    setTimeout(next, 1000);
  }
};
