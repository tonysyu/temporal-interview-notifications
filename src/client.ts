import { Connection, Client } from '@temporalio/client';
import { cancelSubscription, subscriptionWorkflow } from './workflows';
import { nanoid } from 'nanoid';

async function run() {
    // Connect to the default Server location (localhost:7233)
    const connection = await Connection.connect();
    // In production, pass options to configure TLS and other settings:
    // {
    //   address: 'foo.bar.tmprl.cloud',
    //   tls: {}
    // }

    const client = new Client({
        connection,
        // namespace: 'foo.bar', // connects to 'default' namespace if not specified
    });

    const handle = await client.workflow.start(subscriptionWorkflow, {
        // type inference works! args: [name: string]
        args: ['tsyu80@gmail.com', '30 seconds'],
        taskQueue: 'hello-world',
        // in practice, use a meaningful business id, eg customerId or transactionId
        workflowId: 'workflow-' + nanoid(),
    });
    console.log(`Started workflow ${handle.workflowId}`);

    // Harded cancellation signal to trigger cancellation flow:
    await handle.signal(cancelSubscription);

    // optional: wait for client result
    console.log(await handle.result()); // Hello, Temporal!
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
