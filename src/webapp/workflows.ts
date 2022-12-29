import express from 'express';
export const router = express.Router()

import { BadInputError } from './errors';
import * as client from '../client';
import * as constants from '../constants';

const NOTIFICATION_MESSAGES = new Map<constants.SignalType, string>([
    [constants.CANCEL_SIGNAL, 'Interview cancelled'],
    [constants.CANDIDATE_JOIN_SIGNAL, 'Candidate joined'],
    [constants.INTERVIEWER_READY_SIGNAL, 'Interviewer ready'],
]);

router.post('/interviews/start', async (req, res) => {
    const startTime = req.body.startTime ?? '10 seconds'
    const duration = req.body.duration ?? '10 seconds'
    const workflowId = await client.start(req.body.user, startTime, duration);
    res.json({
        message: `Interview workflow started: ${workflowId}`,
    });
})

router.post('/interviews/update', async (req, res, next) => {
    const signal = req.body.signal;
    const message = NOTIFICATION_MESSAGES.get(signal);
    try {
        if (!message) {
            const keys = Array.from(NOTIFICATION_MESSAGES.keys()).join(', ');
            throw new BadInputError(
                `Unknown signal '${signal}'. Expected value in ${keys}`
            );
        }

        const workflowId = await client.signal(req.body.user, signal);
        res.json({
            message: `${message} (id: ${workflowId})`,
        });
    } catch (err) {
        next(err);
    }
})
