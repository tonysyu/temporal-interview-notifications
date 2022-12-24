import express from 'express';
import { NOTIFICATION_PATH, PORT, WORKFLOW_PATH } from './constants';
import { router as workflowRouter } from './webapp/workflows';
import { router as notificationRouter } from './webapp/notifications';

const app = express()

app.use(express.json());

app.use(`/${WORKFLOW_PATH}`, workflowRouter);
app.use(`/${NOTIFICATION_PATH}`, notificationRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
