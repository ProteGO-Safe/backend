import {statisticsRepository} from "./services";
import {notificationRepository} from "../notification/services";
import {NotificationType} from "../notification/notificationType";
import sendSlackMessage from "../slack/SlackMessageSender";
import SlackMessage from "../slack/SlackMessage";
import {Color} from "../colors";
import SlackMessageDetailsItem from "../slack/SlackMessageDetailsItem";
import Statistic from "./repository/Statistic";
import Notification from "../notification/Notification";

const logStatisticsPublishingStatus = async () => {

    const now = new Date();

    const iosNotification = await notificationRepository.getByDateAndType(now, NotificationType.STATISTICS_IOS);
    const androidNotification = await notificationRepository.getByDateAndType(now, NotificationType.STATISTICS_ANDROID);

    const statistic = await statisticsRepository.getByTheSameDate(now);

    if (!statistic) {
        const slackMessage = {title: "there is no statistic to send push :x:", color: Color.RED, detailsItems: []} as SlackMessage;
        await sendSlackMessage(slackMessage);
        return;
    }

    await processNotification(iosNotification, statistic, NotificationType.STATISTICS_IOS);
    await processNotification(androidNotification, statistic, NotificationType.STATISTICS_ANDROID);
};

const processNotification = async (notification: Notification | null, statistic: Statistic, notificationType: NotificationType) => {
    if (notification && notification.sent) {
        await processSuccess(statistic, notificationType);
    } else {
        await processFailed(notificationType);
    }
};

const processSuccess = async (statistic: Statistic, notificationType: NotificationType) => {
    const {dashboard} = statistic;
    const detailsItems = [
        {title: "newVaccinations", value: String(dashboard.newVaccinations)},
        {title: "newVaccinationsDose1", value: String(dashboard.newVaccinationsDose1)},
        {title: "newVaccinationsDose2", value: String(dashboard.newVaccinationsDose2)},
        {title: "newCases", value: String(dashboard.newCases)},
        {title: "newDeaths", value: String(dashboard.newDeaths)},
        {title: "newRecovered", value: String(dashboard.newRecovered)}
        ] as SlackMessageDetailsItem[];
    const slackMessage = {title: `success sending push ${notificationType} :heavy_check_mark:`, color: Color.GREEN, detailsItems} as SlackMessage;
    await sendSlackMessage(slackMessage)
};

const processFailed = async (notificationType: NotificationType) => {
    const slackMessage = {title: `failed sending push ${notificationType} :x:`, color: Color.RED, detailsItems: []} as SlackMessage;
    await sendSlackMessage(slackMessage)
};


export default logStatisticsPublishingStatus;