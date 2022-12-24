import chalk from 'chalk';

export async function notifyInterviewCancelled(user: string): Promise<boolean> {
    log(user, 'Your interview was cancelled');
    return true
}

export async function notifyInterviewStartsNow(user: string): Promise<boolean> {
    log(user, 'Your interview starts now');
    return true
}

export async function notifyInterviewConfirmed(user: string): Promise<boolean> {
    log(user, 'Your interview is scheduled');
    return true
}

function log(user: string, action: string) {
    const formattedEmail = chalk.yellowBright.bold(user);
    const formattedAction = chalk.whiteBright.bold(action);
    const formattedTimestamp = chalk.blueBright(new Date().toLocaleTimeString());
    console.log(`${formattedTimestamp}: ${formattedEmail} - ${formattedAction}`)
}
