import axios, { AxiosResponse } from 'axios';

import { NOTIFICATION_PATH, PORT, NotificationType } from './constants';

const NOTIFICATION_URL = `http://localhost:${PORT}/${NOTIFICATION_PATH}/send`;

export const requestNotification = async function(user: string, type: NotificationType): Promise<AxiosResponse> {
    return await axios.post(NOTIFICATION_URL, {user, type});
};
