import express from 'express';
export const router = express.Router()

import { BadInputError } from './errors';
import * as client from '../client';

interface WorkflowSignal {
    fn: (user: string) => Promise<string>,
    message: string,
}

const NOTIFICATION_MESSAGES = new Map<string, WorkflowSignal>([
    ['CANCEL', {fn: client.cancel, message: 'Interview cancelled'}],
]);

router.post('/interviews/start', async (req, res) => {
    const workflowId = await client.run(req.body.user);
    res.json({
        message: `Interview workflow started: ${workflowId}`,
    });
})

router.post('/interviews/update', async (req, res, next) => {
    const signal = NOTIFICATION_MESSAGES.get(req.body.signal);
    try {
        if (!signal) {
            const keys = Array.from(NOTIFICATION_MESSAGES.keys()).join(', ');
            throw new BadInputError(
                `Unknown signal '${req.body.signal}'. Expected value in ${keys}`
            );
        }

        const workflowId = await signal.fn(req.body.user);
        res.json({
            message: `${signal.message} (id: ${workflowId})`,
        });
    } catch (err) {
        next(err);
    }
})
