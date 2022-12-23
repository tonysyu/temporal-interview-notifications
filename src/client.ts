// Temporal client responsible for initiating workflow
import { Connection, WorkflowClient } from '@temporalio/client';
import { cancelSubscription, subscriptionWorkflow } from './workflows';


const TASK_NAME = 'hello-world';

function helloWorldWorkflowId(email: string): string {
    return `${TASK_NAME}-${email}`;
}


async function getWorkflowClient(): Promise<WorkflowClient> {

    // Connect to the default Server location (localhost:7233)
    const connection = await Connection.connect();

    return new WorkflowClient({
        connection,
        // namespace: 'foo.bar', // connects to 'default' namespace if not specified
    });
}


export async function run(email: string): Promise<string> {
    const client = await getWorkflowClient();

    const workflowId = helloWorldWorkflowId(email);

    const handle = await client.start(subscriptionWorkflow, {
        args: [email, '10 seconds'],
        taskQueue: TASK_NAME,
        workflowId,
    });
    console.log(`Started workflow ${handle.workflowId}`);
    return workflowId
}


export async function cancel(email: string) {
    const client = await getWorkflowClient();
    const workflowId = helloWorldWorkflowId(email);
    const handle = client.getHandle(workflowId)

    // Trigger cancel signal on the workflow
    await handle.signal(cancelSubscription);

    // optional: wait for client result
    console.log(await handle.result()); // Hello, Temporal!
    return workflowId
}
