import express from 'express';

import { mockEmail } from './utils';
import * as constants from '../constants';

export const router = express.Router()

router.post('/send', async (req, res) => {
    const user = validateUser(req.body.user);
    const message = getNotificationMessage(req.body.type);
    console.log(mockEmail(user, message));
})

function validateUser(user: string | null): string {
    if (!user) {
        throw Error('User not provided');
    }
    return user;
}

function getNotificationMessage(notificationType: string): string {
    const message = NOTIFICATION_MESSAGES.get(notificationType);
    if (!message) {
        throw Error(`Unknown notification type ${notificationType}`);
    }
    return message;
}

const NOTIFICATION_MESSAGES = new Map([
    [constants.INTERVIEW_CONFIRMATION, 'Your interview is scheduled'],
    [constants.INTERVIEW_STARTS_NOW, 'Your interview starts now'],
    [constants.INTERVIEW_CANCELLED, 'Your interview was cancelled'],
])
