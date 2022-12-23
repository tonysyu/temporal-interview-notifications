import chalk from 'chalk';

export async function sendCancellationDuringTrialPeriodEmail(email: string): Promise<boolean> {
    log(email, 'cancelled during trial period');
    return true
}

export async function sendSubscriptionOverEmail(email: string): Promise<boolean> {
    log(email, 'send subscription offer');
    return true
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
    log(email, 'send welcome email');
    return true
}

function log(email: string, action: string) {
    const formattedEmail = chalk.yellowBright.bold(email);
    const formattedAction = chalk.whiteBright.bold(action);
    const formattedTimestamp = chalk.blueBright(new Date().toLocaleTimeString());
    console.log(`${formattedTimestamp}: ${formattedEmail} - ${formattedAction}`)
}
