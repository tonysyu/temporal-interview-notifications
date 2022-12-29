export const PORT = 3000;

export const WORKFLOW_PATH = 'workflows';
export const NOTIFICATION_PATH = 'notifications';
export const TASK_NAME = 'interview-notifications';

export const INTERVIEW_CONFIRMATION = 'INTERVIEW_CONFIRMATION';
export const INTERVIEW_STARTS_NOW = 'INTERVIEW_STARTS_NOW';
export const INTERVIEW_CANCELLED = 'INTERVIEW_CANCELLED';
export const INTERVIEWER_WAITING = 'INTERVIEWER_WAITING';
export type NotificationType = (
    typeof INTERVIEW_CONFIRMATION
    | typeof INTERVIEW_STARTS_NOW
    | typeof INTERVIEW_CANCELLED
    | typeof INTERVIEWER_WAITING
)

export const CANCEL_SIGNAL = 'CANCEL';
export const CANDIDATE_JOIN_SIGNAL = 'CANDIDATE_JOIN';
export const INTERVIEWER_READY_SIGNAL = 'INTERVIEWER_READY';
export type SignalType = (
    typeof CANCEL_SIGNAL
    | typeof CANDIDATE_JOIN_SIGNAL
    | typeof INTERVIEWER_READY_SIGNAL
)
