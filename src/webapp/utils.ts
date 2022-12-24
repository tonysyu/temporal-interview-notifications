export const mockEmail = function(user: string, subject: string): string {
    const to = `"${user}" <${user}@test.com>`;
    const from = '"Indeed Interviews" <test@indeed.com>';
    const date = new Date().toUTCString();
    return `
        From: ${to}
        To: ${from}
        Date: ${date}
        Subject: ${subject}

        ...
    `
}

