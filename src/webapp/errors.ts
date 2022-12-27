import { NextFunction, Request, Response } from 'express';
import { WorkflowNotFoundError } from '@temporalio/workflow';

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
    } else if (err instanceof WorkflowNotFoundError) {
        res.status(400)
        res.send('Workflow not found. Call `start` before `update`.')
    } else {
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
