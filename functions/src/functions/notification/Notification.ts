import Entity from "../repository/Entity";
import {NotificationType} from "./notificationType";

interface Notification extends Entity {
    type: NotificationType,
    sent: boolean,
    date: Date
}

export default Notification;