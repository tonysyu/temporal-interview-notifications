import express from 'express';
import { PORT, WORKFLOW_PATH } from './webapp/constants';
import { router as workflowRouter } from './webapp/workflows';

const app = express()

app.use(express.json());

app.use(`/${WORKFLOW_PATH}`, workflowRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
