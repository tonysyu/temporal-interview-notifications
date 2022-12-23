import { condition, defineSignal, proxyActivities, setHandler } from '@temporalio/workflow';
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
    if (await condition(() => isCanceled, trialPeriod)) {
        await sendCancellationDuringTrialPeriodEmail(email);
    } else {
        await sendSubscriptionOverEmail(email);
    }
}
