import express from 'express';
import { NOTIFICATION_PATH, PORT, WORKFLOW_PATH } from './constants';
import { router as notificationRouter } from './webapp/notifications';
import { router as workflowRouter } from './webapp/workflows';
import { errorHandler } from './webapp/utils';

const app = express()

app.use(express.json());

app.use(`/${WORKFLOW_PATH}`, workflowRouter);
app.use(`/${NOTIFICATION_PATH}`, notificationRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
