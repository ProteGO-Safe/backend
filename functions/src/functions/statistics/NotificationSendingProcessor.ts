import {log} from "firebase-functions/lib/logger";
import {dateToFormattedDayMonth} from "../../utils/dateUtils";
import {Platform} from "../platform";
import {statisticsRepository} from "./services";
import {secretManager} from "../../services";
import sendNotification from "../notification/sendNotification";
import Statistic from "./repository/Statistic";
import {notificationRepository} from "../notification/services";
import {NotificationType} from "../notification/notificationType";
import errorLogger from "../logger/errorLogger";
import errorEntryLabels from "../logger/errorEntryLabels";
import {Color} from "../colors";
import SlackMessage from "../slack/SlackMessage";
import sendSlackMessage from "../slack/SlackMessageSender";

const statisticNotificationsType = {
    [Platform.ANDROID]: NotificationType.STATISTICS_ANDROID,
    [Platform.IOS]: NotificationType.STATISTICS_IOS,
};

const sendStatisticNotification = async () => {

    const now = new Date();

    const statistic = await statisticsRepository.getByTheSameDate(now);

    if (!statistic) {
        log(`no statistics`);
        return;
    }

    try {
        await processStatisticNotification(statistic, now, Platform.ANDROID);
    } catch (e) {
        await processError(e, Platform.ANDROID)
    }

    try {
        await processStatisticNotification(statistic, now, Platform.IOS);
    } catch (e) {
        await processError(e, Platform.ANDROID)
    }

};

const processError = async (e: any, platform: Platform) => {
    errorLogger.error(errorEntryLabels(e), e);
    const slackMessage = {title: `failed sending push to ${platform} :x:`, color: Color.RED, detailsItems: []} as SlackMessage;
    await sendSlackMessage(slackMessage)
};

const processStatisticNotification = async (statistic: Statistic, date: Date, platform: Platform) => {

    const notificationType = statisticNotificationsType[platform];

    const existingNotification = await notificationRepository.getByDateAndType(date, notificationType);

    if (existingNotification) {
        log(`${platform} notification already exists`);
        return;
    }

    log(`Start sending statistic ${platform} notification`);

    const payload = await getPayload(statistic, platform);

    await sendNotification(payload, notificationType);

    log(`Finish sending ${platform} android notification`);

    const slackMessage = {title: `success sending push to ${platform} :x:`, color: Color.GREEN, detailsItems: []} as SlackMessage;
    await sendSlackMessage(slackMessage)
};

const fetchTopic = async (platform: Platform) => {
    const {ios, android} = await secretManager.getConfig('firebaseNotificationTopics');
    if (platform === Platform.ANDROID) {
        return android
    }
    if (platform === Platform.IOS) {
        return ios
    }
    throw new Error('illegal platform value');
};

const getPayload = async (statistic: Statistic, platform: Platform): Promise<any> => {

    const {date, dashboard} = statistic;
    const dateString = dateToFormattedDayMonth(date);
    const topic = await fetchTopic(platform);

    const payload = {
        "to": topic,
        "data": {
            "notification": {
                "localizedNotifications": [
                    {
                        "title": `COVID-19 w Polsce (${dateString})`,
                        "content": `Szczepienia: +${dashboard.newVaccinations} wykonanych szczepień, +${dashboard.newVaccinationsDose1} z 1 dawką i +${dashboard.newVaccinationsDose2} z 2 dawką. COVID-19: +${dashboard.newCases} nowych zakażeń, +${dashboard.newDeaths} zmarło, +${dashboard.newRecovered} wyzdrowiało. Kliknij i zobacz statystyki w aplikacji STOP COVID - ProteGO Safe.`,
                        "languageISO": "pl"
                    },
                    {
                        "title": `COVID-19 in Poland (${dateString})`,
                        "content": `Vaccinations: +${dashboard.newVaccinations} new vaccinations, +${dashboard.newVaccinationsDose1} with 1st dose and +${dashboard.newVaccinationsDose2} with 2nd dose. COVID-19: +${dashboard.newCases} new infections, +${dashboard.newDeaths} deaths, +${dashboard.newRecovered} recoveries. Click and see the statistics in STOP COVID - ProteGO Safe application.`,
                        "languageISO": "en"
                    },
                    {
                        "title": `COVID-19 в Польщі (${dateString})`,
                        "content": `Щеплення: +${dashboard.newVaccinations} нових щеплень, +${dashboard.newVaccinationsDose1} щеплень одною дозою та +${dashboard.newVaccinationsDose2} щеплень другою дозою. COVID-19: +${dashboard.newCases} нових заражень, +${dashboard.newDeaths} померло, +${dashboard.newRecovered} одужало. Клацніть і перегляньте статистику в додатку STOP COVID - ProteGO Safe.`,
                        "languageISO": "uk"
                    },
                    {
                        "title": `COVID-19 in Polen (${dateString})`,
                        "content": `Impfungen: +${dashboard.newVaccinations} neu Geimpfte, +${dashboard.newVaccinationsDose1} mit der 1. Dosis und +${dashboard.newVaccinationsDose2} mit der 2. Dosis. COVID-19: +${dashboard.newCases} neu Infizierte, +${dashboard.newDeaths} Verstorbene, +${dashboard.newRecovered} Genesene. Hier klicken und die Statistik in der App STOP COVID - ProteGO Safe anzeigen.`,
                        "languageISO": "de"
                    },
                    {
                        "title": `COVID-19 в Польше (${dateString})`,
                        "content": `Вакцинация: +${dashboard.newVaccinations} новых прививок, +${dashboard.newVaccinationsDose1} прививок одной дозой и +${dashboard.newVaccinationsDose2} прививок второй дозой. COVID-19: +${dashboard.newCases} новых заражений, +${dashboard.newDeaths} умерло, +${dashboard.newRecovered} выздоровело. Кликните и посмотрите статистику в приложении STOP COVID - ProteGO Safe.`,
                        "languageISO": "ru"
                    },
                    {
                        "title": `Polonya'da COVID-19 (${dateString})`,
                        "content": `Aşı: +${dashboard.newVaccinations} yeni aşılama, +${dashboard.newVaccinationsDose1} ilk doz ve +${dashboard.newVaccinationsDose2} ikinci doz. COVID-19: +${dashboard.newCases} yeni vaka, +${dashboard.newDeaths} vefat, +${dashboard.newRecovered} iyileşen. İstatistikleri STOP COVID-ProteGo Safe uygulamasında görmek için tıklayın.`,
                        "languageISO": "tr"
                    }
                ]
            },
            "route": {
                "name": "home",
            },
            covidStats: dashboard
        }
    };

    return platform === Platform.IOS ? {
        ...payload,
        notification: {
            "click_action": "dailyDataCategoryId",
            "mutable_content": true,
            "title": `COVID-19 w Polsce (${dateString})`,
            "body": `Szczepienia: +${dashboard.newVaccinations} wykonanych szczepień, +${dashboard.newVaccinationsDose1} z 1 dawką i +${dashboard.newVaccinationsDose2} z 2 dawką. COVID-19: +${dashboard.newCases} nowych zakażeń, +${dashboard.newDeaths} zmarło, +${dashboard.newRecovered} wyzdrowiało. Kliknij i zobacz statystyki w aplikacji STOP COVID - ProteGO Safe.`
        }
    } : payload;
};

export default sendStatisticNotification;
