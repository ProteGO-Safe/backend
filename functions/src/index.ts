import * as admin from "firebase-admin";
import * as cloudFunctions from "./cloudFunctions";
import generateCode from "./functions/generateCode";
import {clearUnusedCodes} from "./functions/clearUnusedCodes";
import uploadDiagnosisKeys from "./functions/uploadDiagnosisKeys";
import {getAccessToken} from "./functions/getAccessToken";
import hospitalsParser from "./functions/hospitalsParser";
import faqParser from "./functions/faqParser";
import advicesParser from "./functions/advicesParser";
import backupTranslations from "./functions/backupTranslations";
import generateSubscriptionCode from "./functions/generateSubscriptionCode";
import getSubscriptionCode from "./functions/getSubscriptionCode";
import updateSubscription from "./functions/updateSubscription";
import subscriptionsForTest from "./functions/subscriptionsForTest";

admin.initializeApp();

exports.generateCode = cloudFunctions.https(generateCode);
exports.uploadDiagnosisKeys = cloudFunctions.httpsOnRequest(uploadDiagnosisKeys);
exports.clearUnusedCodes = cloudFunctions.scheduler(clearUnusedCodes, 'every 30 minutes');
exports.getAccessToken = cloudFunctions.https(getAccessToken);
exports.createSubscription = cloudFunctions.httpsOnRequest(subscriptionsForTest);
exports.faqParser = cloudFunctions.scheduler(faqParser, 'every 30 minutes');
exports.hospitalsParser = cloudFunctions.scheduler(hospitalsParser, 'every 30 minutes');
exports.advicesParser = cloudFunctions.scheduler(advicesParser, 'every 30 minutes');
exports.backupTranslations = cloudFunctions.scheduler(backupTranslations, 'every 60 minutes');

exports.generateSubscriptionCode = cloudFunctions.httpsOnRequest(generateSubscriptionCode);
exports.getSubscriptionCode = cloudFunctions.httpsOnRequest(getSubscriptionCode);
exports.updateSubscription = cloudFunctions.httpsOnRequest(updateSubscription);
