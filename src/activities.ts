import chalk from 'chalk';

import * as constants from './constants';
import { requestNotification } from './utils';

export async function notifyInterviewCancelled(user: string): Promise<boolean> {
    await requestNotification(user, constants.INTERVIEW_CANCELLED);
    log(user, 'Sent interview cancellation notification');
    return true
}

export async function notifyInterviewStartsNow(user: string): Promise<boolean> {
    await requestNotification(user, constants.INTERVIEW_STARTS_NOW);
    log(user, 'Sent interview starts now notification');
    return true
}

export async function notifyInterviewConfirmed(user: string): Promise<boolean> {
    await requestNotification(user, constants.INTERVIEW_CONFIRMATION);
    log(user, 'Sent interview scheduled confirmation');
    return true
}

export async function notifyInterviewerWaiting(user: string): Promise<boolean> {
    await requestNotification(user, constants.INTERVIEWER_WAITING);
    log(user, 'Sent interviewer waiting notification');
    return true
}

export async function logMessage(user: string, message: string): Promise<boolean> {
    log(user, message);
    return true
}

function log(user: string, action: string) {
    const formattedEmail = chalk.yellowBright.bold(user);
    const formattedAction = chalk.whiteBright.bold(action);
    const formattedTimestamp = chalk.blueBright(new Date().toLocaleTimeString());
    console.log(`${formattedTimestamp}: ${formattedEmail} - ${formattedAction}`)
}
