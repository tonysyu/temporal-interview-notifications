# Rsvp Notification Worfklow Example

The original code is based off the [Hello World Tutorial](https://learn.temporal.io/getting_started/typescript/hello_world_in_typescript/).
The code was then modified based on the [Subscription Workflow Tutorial](https://learn.temporal.io/tutorials/typescript/subscriptions/).

## Code organization

To understand this code base, first review
[A Practical Approach to Temporal Architecture](https://mikhail.io/2020/10/practical-approach-to-temporal-architecture/).

The main parts of this example map directly to the components described above:
- `temporal-server/`: Temporal Server, which you can treat as a black box (not commited
  to this repo, but is cloned as a prerequisite). You won't modify this code, and you
  won't even need it if you're using [Temporal Cloud](https://temporal.io/cloud).
- `src/workers.ts`: Temporal Worker, which is responsible for running the activities for
  your workflow.
- `src/client.ts`: Temporal Client, which is responsible for initiating and sending
  signals to workflows.
- `src/workflows.ts`: Temporal Workflows, which is the high-level business logic for
  your workflows.
- `src/activites.ts`: Temporal Activies, which is the business logic responsible for
  the actual work (e.g. talking to services).
- `src/app.ts` + `src/webapp/*`: Express app that uses Temporal Client to initiate
  workflows and send signals to workflows.
  - This app is also being used as a mock Notification Service. Typically, this would be
    completely separate service, but this app is reused for convenience.

## Running this example

### Prerequisites

Before getting started, you
- Clone the Temporal Server repo into this directory:
  ```sh
  git clone https://github.com/temporalio/docker-compose.git temporal-server`
  ```
- Install dependencies:
  ```sh
  npm install
  ```

### Starting servers

Running this sample requires 3 separate shells:
1. Server shell: `cd temporal-server/; docker-compose up` to start the Temporal Server
1. Worker shell: `npm run worker.watch` to start the Worker
1. Web App shell: `npm run app.watch` to run an Express app, that will interact with
   the Workflow Client.

You'll also want to fourth shell to interact with the Web App.

### Starting and interacting with workflows

The following examples use [httpie](https://httpie.io/) (i.e. command `http`) to
interact with the Web App.


#### Basic workflow: Confirmation and starts-now notifications

As a simple example, lets have user "alice" start the Rsvp workflow, by hitting the
Web App:

```sh
http http://localhost:3000/workflows/rsvps/start user=alice
```

##### Worker output

The worker is responsible for running through the notification workflow, making requests
to the "Notification Service":
```sh
10:12:50 PM: alice - Sent interview scheduled confirmation
10:13:00 PM: alice - Sent interview starts now notification
```

Note that the last message will take some time to display (currently defined in workflow
as 10 second delay).

##### Web App output

For convenience, the "Notification Service" is actually the same Web App used to
interacts with the Temporal Workflow:


```sh
From: "alice" <alice@test.com>
To: "Indeed Interviews" <test@indeed.com>
Date: Sat, 24 Dec 2022 04:12:50 GMT
Subject: Your interview starts now

...


From: "alice" <alice@test.com>
To: "Indeed Interviews" <test@indeed.com>
Date: Sat, 24 Dec 2022 04:13:00 GMT
Subject: Your interview was cancelled

...
```
