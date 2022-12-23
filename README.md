# Rsvp Notification Worfklow Example

The original code is based off the [Hello World Tutorial](https://docs.temporal.io/typescript/hello-world/).
The code was then modified based on the [Subscription Workflow Tutorial](https://learn.temporal.io/tutorials/typescript/subscriptions/).

## Running this sample

### Starting servers

Pre-requisite: Run `npm install` to install dependencies.

Running this sample requires 3 separate shells:
1. Server shell: `cd temporal-server/; docker-compose up` to start the Temporal Server
1. Worker shell: `npm run worker.watch` to start the Worker
1. App shell: `npm run app.watch` to run an express app, that will interact with
   the Workflow Client.

You'll also want to fourth shell to interact with the app.

### Starting and interacting with workflows

The following examples use [httpie](https://httpie.io/) (i.e. command `http`) to
interact with the App.


As a simple example, lets have user "alice" start the Rsvp workflow, followed by
"bob". Right after that, "alice" cancels the workflow:

```sh
http http://localhost:3000/workflows/rsvps/start email=alice@test.com
http http://localhost:3000/workflows/rsvps/start email=bob@test.com
http http://localhost:3000/workflows/rsvps/update email=alice@test.com
```

Console messages are used in place of email messages, and these are output to the logs
of the worker shell:

```sh
11:57:16 AM: alice@test.com - send welcome email
11:57:16 AM: bob@test.com - send welcome email
11:57:16 AM: alice@test.com - cancelled during trial period
11:57:26 AM: bob@test.com - send subscription offer
```

Note that the last message will take some time to display (currently defined in workflow
as 10 second delay).
