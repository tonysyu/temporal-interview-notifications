import express from 'express';

import * as client from '../client';
import { PORT } from './constants';

export const router = express.Router()

router.post('/rsvps/start', async (req, res) => {
    const workflowId = await client.run(req.body.email);
    res.json({
        message: `Workflow started: ${workflowId}`,
        actions: {
            updateUrl: `http://localhost:${PORT}/update-rsvp`,
        }
    });
})

router.post('/rsvps/update', async (req, res) => {
    const workflowId = await client.cancel(req.body.email);
    res.json({
        message: `Workflow cancelled: ${workflowId}`,
    });
})
