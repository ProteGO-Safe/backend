import {v4} from "uuid";
import Notification from "./Notification";
import {NotificationType} from "./notificationType";

const createNotification = (type: NotificationType): Notification => {

    return {
        id: v4(),
        type,
        sent: false,
        date: new Date()
    }
};

export default createNotification;
