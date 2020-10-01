import * as admin from "firebase-admin";
import * as cloudFunctions from "./cloudFunctions";
import generateCode from "./functions/generateCode";
import {clearUnusedCodes} from "./functions/clearUnusedCodes";
import uploadDiagnosisKeys from "./functions/uploadDiagnosisKeys";
import {getAccessToken} from "./functions/getAccessToken";
import hospitalsParser from "./functions/hospitalsParser";
import faqParser from "./functions/faqParser";
import advicesParser from "./functions/advicesParser";

admin.initializeApp();

exports.generateCode = cloudFunctions.https(generateCode);
exports.uploadDiagnosisKeys = cloudFunctions.httpsOnRequest(uploadDiagnosisKeys);
exports.clearUnusedCodes = cloudFunctions.scheduler(clearUnusedCodes, 'every 30 minutes');
exports.getAccessToken = cloudFunctions.https(getAccessToken);
exports.faqParser = cloudFunctions.scheduler(faqParser, 'every 30 minutes');
exports.hospitalsParser = cloudFunctions.scheduler(hospitalsParser, 'every 30 minutes');
exports.advicesParser = cloudFunctions.scheduler(advicesParser, 'every 30 minutes');
