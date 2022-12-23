import chalk from 'chalk';

export async function notifyEventCancelled(email: string): Promise<boolean> {
    log(email, 'Your interview was cancelled');
    return true
}

export async function notifyStartsNow(email: string): Promise<boolean> {
    log(email, 'Your interview starts now');
    return true
}

export async function notifyRsvpConfirmed(email: string): Promise<boolean> {
    log(email, 'You have successfully RSVPed');
    return true
}

function log(email: string, action: string) {
    const formattedEmail = chalk.yellowBright.bold(email);
    const formattedAction = chalk.whiteBright.bold(action);
    const formattedTimestamp = chalk.blueBright(new Date().toLocaleTimeString());
    console.log(`${formattedTimestamp}: ${formattedEmail} - ${formattedAction}`)
}
