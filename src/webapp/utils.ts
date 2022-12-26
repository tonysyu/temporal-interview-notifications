import chalk from 'chalk';
import { ServiceUnavailableError } from './errors';

export const mockEmail = function(user: string, subject: string): string {
    const to = `"${user}" <${user}@test.com>`;
    const from = '"Talent Attraction" <hiring@fake.org>';
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
