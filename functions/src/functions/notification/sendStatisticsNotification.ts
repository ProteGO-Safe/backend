import Axios from "axios";
import config from "../../config";
import * as admin from "firebase-admin";
import {secretManager} from "../../services";
import CovidStats from "../../utils/CovidStats";

const {log, error} = require("firebase-functions/lib/logger");

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
        error(`Error during sending notification (${platform}), ${reason}`);

        return false;
    });

    if (result) {
        log(`Successfully sending notification (${platform})`);
    } else {
        error(`Could not send notification (${platform})`);
    }
}

enum Platform {
    ANDROID = "ANDROID",
    IOS = "IOS",
}

const getPayload = (topic: string, covidStats: CovidStats, platform: Platform): any => {
    const date = new Date();
    date.setTime(Number(covidStats.updated) * 1000);

    const dateString = `${date.getUTCDate()}.${date.getUTCMonth() + 1}`;

    const payload = {
        "to": topic,
        "data": {
            "notification": {
                "localizedNotifications": [
                    {
                        "title": `COVID-19 w Polsce (${dateString})`,
                        "content": `+${covidStats.newCases} nowych zakażeń, +${covidStats.newDeaths} zmarło, ${covidStats.newRecovered} wyzdrowiało. Kliknij i zobacz statystyki w aplikacji STOP COVID - ProteGO Safe.`,
                        "languageISO": "pl"
                    },
                    {
                        "title": `COVID-19 in Poland (${dateString})`,
                        "content": `+${covidStats.newCases} new infections, +${covidStats.newDeaths} died. Click and see statistics in the STOP COVID - ProteGO Safe app.`,
                        "languageISO": "en"
                    },
                    {
                        "title": `COVID-19 в Польщі (${dateString})`,
                        "content": `+${covidStats.newCases} нових заражень, +${covidStats.newDeaths} померло, {{newRecovered}} видужало. Натисніть і подивіться статистику в додатку STOP COVID - ProteGO Safe.`,
                        "languageISO": "uk"
                    },
                    {
                        "title": `COVID-19 in Polen (${dateString})`,
                        "content": `+${covidStats.newCases} Neuinfizierte, +${covidStats.newDeaths} Verstorbene. Hier klicken und Statistiken in der App STOP COVID - ProteGO Safe verfolgen.`,
                        "languageISO": "de"
                    },
                    {
                        "title": `COVID-19 в Польше (${dateString})`,
                        "content": `+${covidStats.newCases} новых заражений, +${covidStats.newDeaths} умерло. Нажмите и посмотрите статистику в приложении STOP COVID - ProteGO Safe.`,
                        "languageISO": "ru"
                    },
                    {
                        "title": `COVID-19 в Польше (${dateString})`,
                        "content": `+${covidStats.newCases} yeni vaka, +${covidStats.newDeaths} kişi vefat etti. Tıklayın ve istatistikleri STOP COVID - ProteGO Safe uygulamasında görün.`,
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
            "title":  `COVID-19 w Polsce (${dateString})`,
            "body": `+${covidStats.newCases} nowych zakażeń, +${covidStats.newDeaths} zmarło, ${covidStats.newRecovered} wyzdrowiało. Kliknij i zobacz statystyki w aplikacji STOP COVID - ProteGO Safe.`
        }
    } : payload;
}

export default sendStatisticsNotification
