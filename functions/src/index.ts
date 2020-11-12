import * as admin from "firebase-admin";
import * as cloudFunctions from "./cloudFunctions";
import generateCodeWrapper from "./functions/generateCodeWrapper";
import {clearUnusedCodes} from "./functions/clearUnusedCodes";
import uploadDiagnosisKeysHttpHandler from "./functions/uploadDiagnosisKeysHttpHandler";
import {getAccessToken} from "./functions/getAccessToken";
import backupTranslations from "./functions/jobs/backupTranslations";
import getSubscriptionCode from "./functions/freeTest/getSubscriptionCode";
import updateSubscription from "./functions/freeTest/updateSubscription";
import subscriptionsForTest from "./functions/freeTest/subscriptionsForTest";
import generateSubscriptionCode from "./functions/freeTest/generateSubscriptionCode";
import getSubscription from "./functions/freeTest/getSubscription";
import uploadDiagnosisKeysSubscriber from "./functions/efgs/uploadDiagnosisKeysSubscriber";

admin.initializeApp();

exports.backupTranslations = cloudFunctions.scheduler(backupTranslations, 'every 60 minutes');
exports.clearUnusedCodes = cloudFunctions.scheduler(clearUnusedCodes, 'every 30 minutes');
exports.createSubscription = cloudFunctions.httpsOnRequest(subscriptionsForTest);
exports.generateCode = cloudFunctions.https(generateCodeWrapper);
exports.generateSubscriptionCode = cloudFunctions.httpsOnRequest(generateSubscriptionCode);
exports.getAccessToken = cloudFunctions.https(getAccessToken);
exports.getSubscription = cloudFunctions.httpsOnRequest(getSubscription);
exports.getSubscriptionCode = cloudFunctions.httpsOnRequest(getSubscriptionCode);
exports.updateSubscription = cloudFunctions.httpsOnRequest(updateSubscription);
exports.uploadDiagnosisKeys = cloudFunctions.httpsOnRequest(uploadDiagnosisKeysHttpHandler);
exports.uploadDiagnosisKeysSubscriber = cloudFunctions.topicSubscriber(uploadDiagnosisKeysSubscriber);
