import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';

export const mockEmail = function(user: string, subject: string): string {
    const to = `"${user}" <${user}@test.com>`;
    const from = '"Indeed Interviews" <test@indeed.com>';
    const date = new Date().toUTCString();
    return `
        From: ${to}
        To: ${from}
        Date: ${date}
        Subject: ${chalk.whiteBright.bold(subject)}

        ...
    `
}

export const randomFailure = function(flakiness_input: string | number | undefined) {
    if (!flakiness_input) {
        return;
    }
    const flakiness = Number(flakiness_input);
    if (flakiness < 0 || flakiness > 1) {
        throw new Error(`Flakiness must be between 0 and 1 but given ${flakiness}`);
    }

    if (Math.random() < flakiness) {
        throw new ServiceUnavailableError();
    }
}

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
