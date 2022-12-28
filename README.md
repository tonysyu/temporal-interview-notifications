# Scheduled Interview Notification Worfklow Example

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
1. Worker shell: `./worker.sh` to start the Worker
1. Web App shell: `./app.sh` to run an Express app, that will interact with
   the Workflow Client.

You'll also want to fourth shell to interact with the Web App.

Note that the `worker.sh` and `app.sh` are simple wrappers around npm scripts to display
the script name in the shell title bar and easily distinguish the two shells.

### Starting and interacting with workflows

The following examples use [httpie](https://httpie.io/) (i.e. command `http`) to
interact with the Web App.

To make the examples easier to read, we'll define the following shell variables for the
webapp endpoints that interact with the workflow:
```sh
START=http://localhost:3000/workflows/interviews/start
UPDATE=http://localhost:3000/workflows/interviews/update
```

#### Basic workflow: Confirmation and starts-now notifications

As a simple example, lets have user "alice" start the interview notification workflow,
by hitting the Web App API:

```sh
http $START user=alice
```

##### Worker output

The worker is responsible for running through the notification workflow and making
requests to the "Notification Service". For the example above, the output looks like:
```sh
2:45:08 PM: alice - Sent interview scheduled confirmation
2:45:18 PM: alice - Sent interview starts now notification
```

Note that the last message will take some time to display (currently defined in workflow
as 10 second delay).

##### Web App output

For convenience, the "Notification Service" is actually the same Web App used to
interact with the Temporal Workflow, so the notification output can be seen in the app
shell:

```sh
From: "alice" <alice@test.com>
To: "Talent Attraction" <hiring@fake.org>
Date: Mon, 26 Dec 2022 20:45:08 GMT
Subject: Your interview is scheduled

...


From: "alice" <alice@test.com>
To: "Talent Attraction" <hiring@fake.org>
Date: Mon, 26 Dec 2022 20:45:18 GMT
Subject: Your interview starts now

...
```

#### Cancellation workflow

Another common case is to schedule an interview and then cancel it:

```sh
http $START user=alice
http $UPDATE user=alice signal=CANCEL
```

The worker will output the its interactions with the notification service:
```sh
2:02:57 PM: alice - Sent interview scheduled confirmation
2:02:59 PM: alice - Sent interview cancellation notification
```

And the notification service will "send" the confirmation and cancellation messages:

```sh
From: "alice" <alice@test.com>
To: "Talent Attraction" <hiring@fake.org>
Date: Tue, 27 Dec 2022 20:02:57 GMT
Subject: Your interview is scheduled

...


From: "alice" <alice@test.com>
To: "Talent Attraction" <hiring@fake.org>
Date: Tue, 27 Dec 2022 20:02:59 GMT
Subject: Your interview was cancelled

...

```

#### Simulating flaking services

One of the core capabilities of Temporal is to standardize and simplify retry logic. To
exercise this logic, you can run the app with `NOTIFICATION_SERVICE_FLAKINESS`:
```sh
NOTIFICATION_SERVICE_FLAKINESS=0.5 ./app.sh
```
The `0.5` here causes the notification service to return a 503 Service Unavailable error
about 50% of the time.

You can start the workflow like normal:
```sh
http $START user=alice
```

The following example shows the confirmation notification is sent normally, and then
there are multiple failed attempts to send the cancellation notification before finally
succeeding:
```sh
2:14:57 PM: alice - Sent interview scheduled confirmation
2022-12-27T20:15:07.785Z [WARN] Activity failed {
  ...
  attempt: 1,
  ...
}
2022-12-27T20:15:08.825Z [WARN] Activity failed {
  ...
  attempt: 2,
  ...
}
2022-12-27T20:15:10.854Z [WARN] Activity failed {
  ...
  attempt: 3,
  ...
}
2:15:14 PM: alice - Sent interview starts now notification
```
Note that the first failed send is about 10 seconds after the confirmation notification
(i.e. the pre-defined delay between scheduled and start). The first retry after that
failure happens less than a second later, and each subsequent attempt takes longer and
longer due to exponential backoff. See <https://docs.temporal.io/concepts/what-is-a-retry-policy>

The app server displays the notifications plus some logging for the 503 errors:
```sh
From: "alice" <alice@test.com>
To: "Talent Attraction" <hiring@fake.org>
Date: Tue, 27 Dec 2022 20:14:57 GMT
Subject: Your interview is scheduled

...

503: Service Unavailable
503: Service Unavailable
503: Service Unavailable

From: "alice" <alice@test.com>
To: "Talent Attraction" <hiring@fake.org>
Date: Tue, 27 Dec 2022 20:15:14 GMT
Subject: Your interview starts now

...

```
