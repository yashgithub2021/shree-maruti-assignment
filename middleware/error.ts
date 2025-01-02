import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from '../utils/error-handler';

const errorMiddleware = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    console.error(err);

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default errorMiddleware;
