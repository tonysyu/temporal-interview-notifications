import axios from 'axios';

import { NOTIFICATION_PATH, PORT, NotificationType } from './constants';

const NOTIFICATION_URL = `http://localhost:${PORT}/${NOTIFICATION_PATH}/send`;

export const requestNotification = function(user: string, type: NotificationType) {
    axios.post(NOTIFICATION_URL, {user, type})
        .catch((err) => console.log(err));
};
