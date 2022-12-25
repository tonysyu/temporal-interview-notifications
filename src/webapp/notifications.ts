import express from 'express';

import { BadInputError } from './errors';
import { mockEmail, randomFailure } from './utils';
import * as constants from '../constants';

export const router = express.Router()

router.post('/send', async (req, res, next) => {
    try {
        randomFailure(process.env.NOTIFICATION_SERVICE_FLAKINESS);
        const user = validateUser(req.body.user);
        const message = getNotificationMessage(req.body.type);
        console.log(mockEmail(user, message));
    } catch (err) {
        next(err)
    }
})

function validateUser(user: string | null): string {
    if (!user) {
        throw new BadInputError('User not provided');
    }
    return user;
}

function getNotificationMessage(notificationType: string): string {
    const message = NOTIFICATION_MESSAGES.get(notificationType);
    if (!message) {
        throw new BadInputError(`Unknown notification type ${notificationType}`);
    }
    return message;
}

const NOTIFICATION_MESSAGES = new Map([
    [constants.INTERVIEW_CONFIRMATION, 'Your interview is scheduled'],
    [constants.INTERVIEW_STARTS_NOW, 'Your interview starts now'],
    [constants.INTERVIEW_CANCELLED, 'Your interview was cancelled'],
])
