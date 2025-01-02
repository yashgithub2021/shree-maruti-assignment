import { Request, Response, NextFunction } from 'express';

const catchAsyncError = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

export default catchAsyncError;