import express from 'express';
import * as client from './client';

const app = express()
const port = 3000

app.use(express.json());

app.post('/start-hello-world', async (req, res) => {
    const workflowId = await client.run(req.body.email);
    res.json({
        message: `Workflow started: ${workflowId}`,
        cancelUrl: `http://localhost:${port}/cancel-hello-world/${workflowId}`,
    });

})

app.post('/cancel-hello-world', async (req, res) => {
    const workflowId = await client.cancel(req.body.email);
    res.json({
        message: `Workflow canceled: ${workflowId}`,
    });

})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
