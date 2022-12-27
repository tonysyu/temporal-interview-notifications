// Temporal client responsible for initiating workflow
import { Connection, WorkflowClient } from '@temporalio/client';
import { TASK_NAME } from './constants';
import { cancelInterview, interviewNotificationWorkflow } from './workflows';

function interviewNotificationWorkflowId(user: string): string {
    return `${TASK_NAME}-${user}`;
}


async function getWorkflowClient(): Promise<WorkflowClient> {
    // Connect to the default Server location (localhost:7233)
    const connection = await Connection.connect();

    return new WorkflowClient({
        connection,
        // namespace: 'foo.bar', // connects to 'default' namespace if not specified
    });
}


export async function run(user: string): Promise<string> {
    const client = await getWorkflowClient();

    const workflowId = interviewNotificationWorkflowId(user);

    const handle = await client.start(interviewNotificationWorkflow, {
        args: [user, '10 seconds'],
        taskQueue: TASK_NAME,
        workflowId,
    });
    console.log(`Started workflow ${handle.workflowId}`);
    return workflowId
}


export async function cancel(user: string) {
    const client = await getWorkflowClient();
    const workflowId = interviewNotificationWorkflowId(user);
    const handle = client.getHandle(workflowId)

    await handle.signal(cancelInterview);

    return workflowId
}
