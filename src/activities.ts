export async function sendCancellationDuringTrialPeriodEmail(email: string): Promise<boolean> {
    console.log(`${email}: cancelled during trial period`)
    return true
}

export async function sendSubscriptionOverEmail(email: string): Promise<boolean> {
    console.log(`${email}: send subscription offer`)
    return true
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
    console.log(`${email}: send welcome email`)
    return true
}
