export async function sendCancellationDuringTrialPeriodEmail(email: string): Promise<boolean> {
    console.log(`sendCancellationDuringTrialPeriodEmail for ${email}`)
    return true
}

export async function sendSubscriptionOverEmail(email: string): Promise<boolean> {
    console.log(`sendSubscriptionOverEmail for ${email}`)
    return true
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
    console.log(`sendWelcomeEmail for ${email}`)
    return true
}
