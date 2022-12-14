# Hello World

The original code is based off the [Hello World Tutorial](https://docs.temporal.io/typescript/hello-world/).
The code was then modified based on the [Subscription Workflow Tutorial](https://learn.temporal.io/tutorials/typescript/subscriptions/).

### Running this sample

Pre-requisite: Run `npm install` to install dependencies.

Running this sample requires 3 separate shells:
1. Server shell: `cd temporal-server/; docker-compose up` to start the Temporal Server
1. Worker shell: `npm run start.watch` to start the Worker
1. Workflow shell: `npm run workflow` to run the Workflow Client.

Note that console messages are used in place of email messages, and these are output to the logs
of the worker shell:

```bash
sendWelcomeEmail for tsyu80@gmail.com
sendSubscriptionOverEmail for tsyu80@gmail.com
```
