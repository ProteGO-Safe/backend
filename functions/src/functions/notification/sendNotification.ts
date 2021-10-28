import Axios from "axios";
import config from "../../config";
import * as admin from "firebase-admin";
import errorLogger from "../logger/errorLogger";
import errorEntryLabels from "../logger/errorEntryLabels";
import {notificationRepository} from "./services";
import createNotification from "./NotificationFactory";
import {NotificationType} from "./notificationType";

const {log} = require("firebase-functions/lib/logger");

const sendNotification = async (payload: any, notificationType: NotificationType) => {

    log(`Start sending notification`);

    const notification = createNotification(notificationType);

    const token = await admin
        .credential
        .applicationDefault()
        .getAccessToken()
        .then((res) => res["access_token"]);

    await makeRequest(token, payload);

    notification.sent = true;
    await notificationRepository.save(notification);

    log(`Finish sending notification`);
};

const makeRequest = async (token: string, payload: any) => {

    log(`Start making request, payload: ${JSON.stringify(payload)}`);

    const result = await Axios.post(config.notificationUrl, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "access_token_auth": "true"
        },
    }).then(response => response.status === 200 && response.data.hasOwnProperty("message_id")).catch(reason => {
        const sendErrorMessage = `Error during making request, ${reason}`;
        errorLogger.error(errorEntryLabels(sendErrorMessage), sendErrorMessage);

        return false;
    });

    if (result) {
        log(`Successfully making request`);
    } else {
        const errorMessage = `Could not make request`;
        errorLogger.error(errorEntryLabels(errorMessage), errorMessage);
    }
};

export default sendNotification
