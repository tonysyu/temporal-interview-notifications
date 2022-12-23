import { PORT, WORKFLOW_PATH } from './constants';

export const getWorkflowUrl = function(path: string): string {
    return `http://localhost:${PORT}/${WORKFLOW_PATH}/${path}`;
}
