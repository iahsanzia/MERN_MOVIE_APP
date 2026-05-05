import { Request, Response, NextFunction } from "express";

export const catchAsync = <P = any, ResBody = any, ReqBody = any>(
  fn: (
    req: Request<P, ResBody, ReqBody>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => Promise<void>,
) => {
  return (
    req: Request<P, ResBody, ReqBody>,
    res: Response<ResBody>,
    next: NextFunction,
  ) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

// export const catchAsync = (
//   fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
// ) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((error) => {
//       next(error);
//     });
//   };
// };
