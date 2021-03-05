import {ObjectMetadata} from "firebase-functions/lib/providers/storage";
import {log} from "firebase-functions/lib/logger";
import config from "../../config"
import {dateToFormattedDayMonth} from "../../utils/dateUtils";
import {Platform} from "../platform";
import {statisticsRepository} from "./services";
import {secretManager} from "../../services";
import sendNotification from "../notification/sendNotification";
import Statistic from "./repository/Statistic";
import {notificationRepository} from "../notification/services";

const sendStatisticNotification = async (metadata: ObjectMetadata) => {

    const fileName = metadata.name!;
    const now = new Date();

    if (fileName && (fileName !== config.statistics.files.timestamps)) {
        return;
    }

    const existingNotification = await notificationRepository.getByTheSameDate(now);

    if (existingNotification) {
        log(`notification already exists`);
        return;
    }

    log(`Start sending statistic notification`);

    const statistic = await statisticsRepository.getByTheSameDate(now);

    if (!statistic) {
        log(`no statistics`);
        return;
    }

    const androidPayload = await getPayload(statistic, Platform.ANDROID);
    const iosPayload = await getPayload(statistic, Platform.IOS);

    await sendNotification({android: androidPayload, ios: iosPayload});

    log(`Finish sending statistic notification`);
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

    const {dailyData, date} = statistic;
    const dateString = dateToFormattedDayMonth(date);
    const topic = await fetchTopic(platform);

    const payload = {
        "to": topic,
        "data": {
            "notification": {
                "localizedNotifications": [
                    {
                        "title": `COVID-19 w Polsce (${dateString})`,
                        "content": `Szczepienia: +${dailyData.newVaccinations} wykonanych szczepień, +${dailyData.newVaccinationsDose1} z 1 dawką i +${dailyData.newVaccinationsDose2} z 2 dawką. COVID-19: +${dailyData.newCases} nowych zakażeń, +${dailyData.newDeaths} zmarło, +${dailyData.newRecovered} wyzdrowiało. Kliknij i zobacz statystyki w aplikacji STOP COVID - ProteGO Safe.`,
                        "languageISO": "pl"
                    },
                    {
                        "title": `COVID-19 in Poland (${dateString})`,
                        "content": `Vaccinations: +${dailyData.newVaccinations} new vaccinations, +${dailyData.newVaccinationsDose1} with 1st dose and +${dailyData.newVaccinationsDose2} with 2nd dose. COVID-19: +${dailyData.newCases} new infections, +${dailyData.newDeaths} deaths, +${dailyData.newRecovered} recoveries. Click and see the statistics in STOP COVID - ProteGO Safe application.`,
                        "languageISO": "en"
                    },
                    {
                        "title": `COVID-19 в Польщі (${dateString})`,
                        "content": `Щеплення: +${dailyData.newVaccinations} нових щеплень, +${dailyData.newVaccinationsDose1} щеплень одною дозою та +${dailyData.newVaccinationsDose2} щеплень другою дозою. COVID-19: +${dailyData.newCases} нових заражень, +${dailyData.newDeaths} померло, +${dailyData.newRecovered} одужало. Клацніть і перегляньте статистику в додатку STOP COVID - ProteGO Safe.`,
                        "languageISO": "uk"
                    },
                    {
                        "title": `COVID-19 in Polen (${dateString})`,
                        "content": `Impfungen: +${dailyData.newVaccinations} neu Geimpfte, +${dailyData.newVaccinationsDose1} mit der 1. Dosis und +${dailyData.newVaccinationsDose2} mit der 2. Dosis. COVID-19: +${dailyData.newCases} neu Infizierte, +${dailyData.newDeaths} Verstorbene, +${dailyData.newRecovered} Genesene. Hier klicken und die Statistik in der App STOP COVID - ProteGO Safe anzeigen.`,
                        "languageISO": "de"
                    },
                    {
                        "title": `COVID-19 в Польше (${dateString})`,
                        "content": `Вакцинация: +${dailyData.newVaccinations} новых прививок, +${dailyData.newVaccinationsDose1} прививок одной дозой и +${dailyData.newVaccinationsDose2} прививок второй дозой. COVID-19: +${dailyData.newCases} новых заражений, +${dailyData.newDeaths} умерло, +${dailyData.newRecovered} выздоровело. Кликните и посмотрите статистику в приложении STOP COVID - ProteGO Safe.`,
                        "languageISO": "ru"
                    },
                    {
                        "title": `Polonya'da COVID-19 (${dateString})`,
                        "content": `Aşı: +${dailyData.newVaccinations} yeni aşılama, +${dailyData.newVaccinationsDose1} ilk doz ve +${dailyData.newVaccinationsDose2} ikinci doz. COVID-19: +${dailyData.newCases} yeni vaka, +${dailyData.newDeaths} vefat, +${dailyData.newRecovered} iyileşen. İstatistikleri STOP COVID-ProteGo Safe uygulamasında görmek için tıklayın.`,
                        "languageISO": "tr"
                    }
                ]
            },
            "route": {
                "name": "home",
            },
            covidStats: dailyData
        }
    };

    return platform === Platform.IOS ? {
        ...payload,
        notification: {
            "click_action": "dailyDataCategoryId",
            "mutable_content": true,
            "title": `COVID-19 w Polsce (${dateString})`,
            "body": `Szczepienia: +${dailyData.newVaccinations} wykonanych szczepień, +${dailyData.newVaccinationsDose1} z 1 dawką i +${dailyData.newVaccinationsDose2} z 2 dawką. COVID-19: +${dailyData.newCases} nowych zakażeń, +${dailyData.newDeaths} zmarło, +${dailyData.newRecovered} wyzdrowiało. Kliknij i zobacz statystyki w aplikacji STOP COVID - ProteGO Safe.`
        }
    } : payload;
};

export default sendStatisticNotification;
