// Temporal client responsible for initiating workflow
import { Connection, WorkflowClient } from '@temporalio/client';
import * as constants from './constants';
import * as workflows from './workflows';

const SIGNALS = new Map([
    [constants.CANCEL_SIGNAL, workflows.cancelInterview],
    [constants.CANDIDATE_JOIN_SIGNAL, workflows.candidateJoined],
    [constants.INTERVIEWER_READY_SIGNAL, workflows.interviewerReady],
]);

function interviewNotificationWorkflowId(user: string): string {
    return `${constants.TASK_NAME}-${user}`;
}


async function getWorkflowClient(): Promise<WorkflowClient> {
    // Connect to the default Server location (localhost:7233)
    const connection = await Connection.connect();

    return new WorkflowClient({
        connection,
        // namespace: 'foo.bar', // connects to 'default' namespace if not specified
    });
}


export async function start(
    user: string,
    timeUntilInterview: string,
    interviewDuration: string,
): Promise<string> {
    const client = await getWorkflowClient();

    const workflowId = interviewNotificationWorkflowId(user);

    await client.start(workflows.interviewNotificationWorkflow, {
        args: [user, timeUntilInterview, interviewDuration],
        taskQueue: constants.TASK_NAME,
        workflowId,
    });
    return workflowId
}


export async function signal(user: string, signal: constants.SignalType) {
    const client = await getWorkflowClient();
    const workflowId = interviewNotificationWorkflowId(user);
    const handle = client.getHandle(workflowId)

    const signalDef = SIGNALS.get(signal)
    if (signalDef) {
        await handle.signal(signalDef);
    }

    return workflowId
}
