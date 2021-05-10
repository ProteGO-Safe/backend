import {statisticsRepository} from "./services";
import {notificationRepository} from "../notification/services";
import {NotificationType} from "../notification/notificationType";
import sendSlackMessage from "../slack/SlackMessageSender";
import SlackMessage from "../slack/SlackMessage";
import {Color} from "../colors";
import SlackMessageDetailsItem from "../slack/SlackMessageDetailsItem";

const logStatisticsPublishingStatus = async () => {

    const now = new Date();

    const notification = await notificationRepository.getByDateAndType(now, NotificationType.STATISTICS);

    if (notification && notification.sent) {
        await processSuccess(now);
        return;
    }

    await processFailed();
};

const processSuccess = async (date: Date) => {
    const statistic = await statisticsRepository.getByTheSameDate(date);
    const {dashboard} = statistic!;
    const detailsItems = [
        {title: "newVaccinations", value: String(dashboard.newVaccinations)},
        {title: "newVaccinationsDose1", value: String(dashboard.newVaccinationsDose1)},
        {title: "newVaccinationsDose2", value: String(dashboard.newVaccinationsDose2)},
        {title: "newCases", value: String(dashboard.newCases)},
        {title: "newDeaths", value: String(dashboard.newDeaths)},
        {title: "newRecovered", value: String(dashboard.newRecovered)}
        ] as SlackMessageDetailsItem[];
    const slackMessage = {title: "success sending push :heavy_check_mark:", color: Color.GREEN, detailsItems} as SlackMessage;
    await sendSlackMessage(slackMessage)
};

const processFailed = async () => {
    const slackMessage = {title: "failed sending push :x:", color: Color.RED, detailsItems: []} as SlackMessage;
    await sendSlackMessage(slackMessage)
};


export default logStatisticsPublishingStatus;