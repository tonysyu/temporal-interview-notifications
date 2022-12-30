import { condition, defineSignal, proxyActivities, setHandler } from '@temporalio/workflow';
import ms from 'ms';
import type * as activities from './activities';

const act = proxyActivities<typeof activities>({
    startToCloseTimeout: '30 seconds',
});

export const cancelInterview = defineSignal('cancelInterview');
export const interviewerReady = defineSignal('interviewerReady');
export const candidateJoined = defineSignal('candidateJoined');

/**
 * Temporal workflow for Interview Notifications
 * @param user: Name of user (in real code, this might be a userId, instead)
 * @param timeUntilInterviewStart: Time used to schedule notification for interview start
 * @param interviewDuration: Proxy time for how long after the start time
 *     interviewer-ready notifications should be sent.
 */
export async function interviewNotificationWorkflow(
    user: string,
    timeUntilInterviewStart: string,
    interviewDuration: string,
) {
    // In general, Temporal workflows need to satisfy deterministic constraints.
    // (See https://docs.temporal.io/workflows#deterministic-constraints). So in other
    // languages, the equivalent of `Date` should not be used in workflows. For
    // typescript, however, global variables (like `Date`) are sandboxed and safe.
    // See https://legacy-documentation-sdks.temporal.io/typescript/determinism
    const startTime = Date.now() + ms(timeUntilInterviewStart);
    const endTime = startTime + ms(interviewDuration);

    await act.logMessage(user, '=========== Started workflow ===========');
    let isCancelled = false;
    let interviewerIsReady = false;
    let candidateHasJoined = false;

    setHandler(cancelInterview, () => void (isCancelled = true));
    setHandler(interviewerReady, () => void (interviewerIsReady = true));
    setHandler(candidateJoined, () => void (candidateHasJoined = true));

    await act.notifyInterviewConfirmed(user);

    if (await condition(
        () => (candidateHasJoined || interviewerIsReady || isCancelled),
        startTime - Date.now())
    ) {
        if (candidateHasJoined) {
            await act.logMessage(user, 'Candidate joined interview');
        } else if (interviewerIsReady) {
            await act.notifyInterviewerWaiting(user);
        } else if (isCancelled) {
            await act.notifyInterviewCancelled(user);
        }
    } else {
        await act.notifyInterviewStartsNow(user);
        if (await condition(
            () => (interviewerIsReady && !candidateHasJoined),
            endTime - Date.now())
        ) {
            await act.notifyInterviewerWaiting(user);
        }
    }
    await act.logMessage(user, '~~~~~~~~~~ Completed workflow ~~~~~~~~~~');
}
