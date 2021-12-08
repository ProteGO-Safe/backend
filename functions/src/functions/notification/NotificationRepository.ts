import EntityRepository from "../repository/EntityRepository";
import Notification from "./Notification";
import {getEndOfDay, getStartOfDay} from "../../utils/dateUtils";
import {NotificationType} from "./notificationType";

class NotificationRepository extends EntityRepository {

    collectionName: string = 'notifications';

    private static createNotification(data: any): any {
        return {
            ...data,
            date: data.date.toDate(),
        }
    }

    async getByDateAndType(date: Date, type: NotificationType): Promise<Notification | null> {

        const snapshot = await this.getCollection()
            .where('date', '>', getStartOfDay(date))
            .where('date', '<', getEndOfDay(date))
            .where('type', '==', type)
            .limit(1)
            .get();
        if (snapshot.empty) {
            return null;
        }
        return snapshot.docs
            .map((item) => item.data())
            .map(NotificationRepository.createNotification)[0];
    }
}

export default NotificationRepository;
