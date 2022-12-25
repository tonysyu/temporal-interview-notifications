import { NextFunction, Request, Response } from 'express';

abstract class HttpError {
    abstract status: number;
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export const errorHandler = function(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        console.log(`${err.status}: ${err.message}`);
        res.status(err.status)
        res.send(err.message)
    } else {
        console.log("ERROR HAS NO STATUS");
        next(err)
    }
}

export class BadInputError extends HttpError {
    status = 400
}

export class ServiceUnavailableError extends HttpError {
    status = 503
    constructor(message = "Service Unavailable") {
        super(message);
    }
}
