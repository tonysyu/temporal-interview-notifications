import { condition, defineSignal, proxyActivities, setHandler } from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';

const act = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute',
});

export const cancelSubscription = defineSignal('cancelSignal');

export async function interviewNotificationWorkflow(
    user: string,
    timeUntilInterview: string | number
) {
    let isCancelled = false;
    setHandler(cancelSubscription, () => void (isCancelled = true));

    await act.notifyInterviewConfirmed(user);
    if (await condition(() => isCancelled, timeUntilInterview)) {
        await act.notifyInterviewCancelled(user);
    } else {
        await act.notifyInterviewStartsNow(user);
    }
}
