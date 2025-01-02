class ErrorHandler extends Error {
    statusCode: number;

    constructor(msg: string, status: number) {
        super(msg);
        this.statusCode = status;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;