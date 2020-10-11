import * as admin from "firebase-admin";
import * as cloudFunctions from "./cloudFunctions";
import generateCode from "./functions/generateCode";
import {clearUnusedCodes} from "./functions/clearUnusedCodes";
import uploadDiagnosisKeysHttpHandler from "./functions/uploadDiagnosisKeysHttpHandler";
import {getAccessToken} from "./functions/getAccessToken";
import hospitalsParser from "./functions/hospitalsParser";
import faqParser from "./functions/faqParser";
import advicesParser from "./functions/advicesParser";
import backupTranslations from "./functions/backupTranslations";
import uploadDiagnosisKeysSubscriber from "./functions/efgs/uploadDiagnosisKeysSubscriber";

admin.initializeApp();

exports.generateCode = cloudFunctions.https(generateCode);
exports.uploadDiagnosisKeys = cloudFunctions.httpsOnRequest(uploadDiagnosisKeysHttpHandler);
exports.clearUnusedCodes = cloudFunctions.scheduler(clearUnusedCodes, 'every 30 minutes');
exports.getAccessToken = cloudFunctions.https(getAccessToken);
exports.faqParser = cloudFunctions.scheduler(faqParser, 'every 30 minutes');
exports.hospitalsParser = cloudFunctions.scheduler(hospitalsParser, 'every 30 minutes');
exports.advicesParser = cloudFunctions.scheduler(advicesParser, 'every 30 minutes');
exports.backupTranslations = cloudFunctions.scheduler(backupTranslations, 'every 60 minutes');
exports.uploadDiagnosisKeysSubscriber = cloudFunctions.topicSubscriber(uploadDiagnosisKeysSubscriber);
