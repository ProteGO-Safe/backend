import Axios from "axios";
import config from "../../config";
import * as admin from "firebase-admin";
import {secretManager} from "../../services";
import CovidStats from "../../utils/CovidStats";
import {timestampToFormattedDayMonth} from "../../utils/dateUtils";
import errorLogger from "../logger/errorLogger";
import errorEntryLabels from "../logger/errorEntryLabels";

const {log} = require("firebase-functions/lib/logger");

const sendStatisticsNotification = async (covidStats: CovidStats) => {
    const token = await admin
        .credential
        .applicationDefault()
        .getAccessToken()
        .then((res) => res["access_token"]);

    const {ios, android} = await secretManager.getConfig('firebaseNotificationTopics');

    await sendNotification(token, covidStats, android, Platform.ANDROID);
    await sendNotification(token, covidStats, ios, Platform.IOS);
}

const sendNotification = async (token: string, covidStats: CovidStats, topic: string, platform: Platform) => {
    const payload = getPayload(topic, covidStats, platform);

    log(`Start sending notification (${platform}), topic: ${topic}, payload: ${JSON.stringify(payload)}`);

    const result = await Axios.post(config.notificationUrl, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "access_token_auth": "true"
        },
    }).then(response => response.status === 200 && response.data.hasOwnProperty("message_id")).catch(reason => {
        const sendErrorMessage = `Error during sending notification (${platform}), ${reason}`;
        errorLogger.error(errorEntryLabels(sendErrorMessage), sendErrorMessage);

        return false;
    });

    if (result) {
        log(`Successfully sending notification (${platform})`);
    } else {
        const errorMessage = `Could not send notification (${platform})`;
        errorLogger.error(errorEntryLabels(errorMessage), errorMessage);
    }
}

enum Platform {
    ANDROID = "ANDROID",
    IOS = "IOS",
}

const getPayload = (topic: string, covidStats: CovidStats, platform: Platform): any => {
    const date = new Date();
    date.setTime(Number(covidStats.updated) * 1000);

    const dateString = timestampToFormattedDayMonth(covidStats.updated);

    const payload = {
        "to": topic,
        "data": {
            "notification": {
                "localizedNotifications": [
                    {
                        "title": `COVID-19 w Polsce (${dateString})`,
                        "content": `Szczepienia: +${covidStats.newVaccinations} wykonanych szczepień, +${covidStats.newVaccinationsDose1} z 1 dawką i +${covidStats.newVaccinationsDose2} z 2 dawką. COVID-19: +${covidStats.newCases} nowych zakażeń, +${covidStats.newDeaths} zmarło, +${covidStats.newRecovered} wyzdrowiało. Kliknij i zobacz statystyki w aplikacji STOP COVID - ProteGO Safe.`,
                        "languageISO": "pl"
                    },
                    {
                        "title": `COVID-19 in Poland (${dateString})`,
                        "content": `Vaccinations: +${covidStats.newVaccinations} new vaccinations, +${covidStats.newVaccinationsDose1} with 1st dose and +${covidStats.newVaccinationsDose2} with 2nd dose. COVID-19: +${covidStats.newCases} new infections, +${covidStats.newDeaths} deaths, +${covidStats.newRecovered} recoveries. Click and see the statistics in STOP COVID - ProteGO Safe application.`,
                        "languageISO": "en"
                    },
                    {
                        "title": `COVID-19 в Польщі (${dateString})`,
                        "content": `Щеплення: +${covidStats.newVaccinations} нових щеплень, +${covidStats.newVaccinationsDose1} щеплень одною дозою та +${covidStats.newVaccinationsDose2} щеплень другою дозою. COVID-19: +${covidStats.newCases} нових заражень, +${covidStats.newDeaths} померло, +${covidStats.newRecovered} одужало. Клацніть і перегляньте статистику в додатку STOP COVID - ProteGO Safe.`,
                        "languageISO": "uk"
                    },
                    {
                        "title": `COVID-19 in Polen (${dateString})`,
                        "content": `Impfungen: +${covidStats.newVaccinations} neu Geimpfte, +${covidStats.newVaccinationsDose1} mit der 1. Dosis und +${covidStats.newVaccinationsDose2} mit der 2. Dosis. COVID-19: +${covidStats.newCases} neu Infizierte, +${covidStats.newDeaths} Verstorbene, +${covidStats.newRecovered} Genesene. Hier klicken und die Statistik in der App STOP COVID - ProteGO Safe anzeigen.`,
                        "languageISO": "de"
                    },
                    {
                        "title": `COVID-19 в Польше (${dateString})`,
                        "content": `Вакцинация: +${covidStats.newVaccinations} новых прививок, +${covidStats.newVaccinationsDose1} прививок одной дозой и +${covidStats.newVaccinationsDose2} прививок второй дозой. COVID-19: +${covidStats.newCases} новых заражений, +${covidStats.newDeaths} умерло, +${covidStats.newRecovered} выздоровело. Кликните и посмотрите статистику в приложении STOP COVID - ProteGO Safe.`,
                        "languageISO": "ru"
                    },
                    {
                        "title": `Polonya'da COVID-19 (${dateString})`,
                        "content": `Aşı: +${covidStats.newVaccinations} yeni aşılama, +${covidStats.newVaccinationsDose1} ilk doz ve +${covidStats.newVaccinationsDose2} ikinci doz. COVID-19: +${covidStats.newCases} yeni vaka, +${covidStats.newDeaths} vefat, +${covidStats.newRecovered} iyileşen. İstatistikleri STOP COVID-ProteGo Safe uygulamasında görmek için tıklayın.`,
                        "languageISO": "tr"
                    }
                ]
            },
            "route": {
                "name": "home",
            },
            covidStats
        }
    };

    return platform === Platform.IOS ? {
        ...payload,
        notification: {
            "click_action": "covidStatsCategoryId",
            "mutable_content": true,
            "title": `COVID-19 w Polsce (${dateString})`,
            "body": `Szczepienia: +${covidStats.newVaccinations} wykonanych szczepień, +${covidStats.newVaccinationsDose1} z 1 dawką i +${covidStats.newVaccinationsDose2} z 2 dawką. COVID-19: +${covidStats.newCases} nowych zakażeń, +${covidStats.newDeaths} zmarło, +${covidStats.newRecovered} wyzdrowiało. Kliknij i zobacz statystyki w aplikacji STOP COVID - ProteGO Safe.`
        }
    } : payload;
}

export default sendStatisticsNotification
