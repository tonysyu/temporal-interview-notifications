import { defineSignal, proxyActivities, setHandler, sleep } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const {
    sendCancellationDuringTrialPeriodEmail, sendSubscriptionOverEmail, sendWelcomeEmail
} = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
});

export const cancelSubscription = defineSignal('cancelSignal');

export async function subscriptionWorkflow(
    email: string,
    trialPeriod: string | number
) {

    let isCanceled = false;
    setHandler(cancelSubscription, () => void (isCanceled = true));

    await sendWelcomeEmail(email);
    await sleep(trialPeriod);
    if (isCanceled) {
        await sendCancellationDuringTrialPeriodEmail(email);
    } else {
        await sendSubscriptionOverEmail(email);
    }
}
