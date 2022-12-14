# Hello World

This is the default project that is scaffolded out when you run `npx @temporalio/create@latest ./myfolder`.

The [Hello World Tutorial](https://docs.temporal.io/typescript/hello-world/) walks through the code in this sample.

### Running this sample

Pre-requisite: Run `npm install` to install dependencies.

Running this sample requires 3 separate shells:
1. Server shell: `cd temporal-server/; docker-compose up` to start the Temporal Server
1. Worker shell: `npm run start.watch` to start the Worker
1. Workflow shell: `npm run workflow` to run the Workflow Client.

The Workflow should return:

```bash
Hello, Temporal!
```
