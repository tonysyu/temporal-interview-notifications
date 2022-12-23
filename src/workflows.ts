import { condition, defineSignal, proxyActivities, setHandler } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const {
    notifyEventCancelled, notifyStartsNow, notifyRsvpConfirmed
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

    await notifyRsvpConfirmed(email);
    if (await condition(() => isCanceled, trialPeriod)) {
        await notifyEventCancelled(email);
    } else {
        await notifyStartsNow(email);
    }
}
