import { proxyActivities, sleep } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const { sendSubscriptionOverEmail, sendWelcomeEmail } = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
});

export async function subscriptionWorkflow(
    email: string,
    trialPeriod: string | number
) {
    await sendWelcomeEmail(email);
    await sleep(trialPeriod);
    await sendSubscriptionOverEmail(email);
}
