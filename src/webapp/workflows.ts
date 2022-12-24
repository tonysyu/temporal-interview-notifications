import express from 'express';

import * as client from '../client';

export const router = express.Router()

router.post('/rsvps/start', async (req, res) => {
    const workflowId = await client.run(req.body.user);
    res.json({
        message: `Workflow started: ${workflowId}`,
    });
})

router.post('/rsvps/update', async (req, res) => {
    const workflowId = await client.cancel(req.body.user);
    res.json({
        message: `Workflow cancelled: ${workflowId}`,
    });
})
