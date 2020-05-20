import * as admin from "firebase-admin";
import * as cloudFunctions from "./cloudFunctions";
const functions = require('firebase-functions');
import generateCode from "./functions/generateCode";
import {clearUnusedCodes} from "./functions/clearUnusedCodes";
import uploadDiagnosisKeys from "./functions/uploadDiagnosisKeys";
import {getAccessToken} from "./functions/getAccessToken";
import hospitalsParser from "./functions/hospitalsParser";
import faqParser from "./functions/faqParser";
import advicesParser from "./functions/advicesParser";

admin.initializeApp();

exports.generateCode = cloudFunctions.https(generateCode);
exports.uploadDiagnosisKeys = cloudFunctions.https(uploadDiagnosisKeys);
exports.clearUnusedCodes = cloudFunctions.scheduler(clearUnusedCodes, 'every 30 minutes');
exports.getAccessToken = cloudFunctions.https(getAccessToken);
exports.faqParser = functions.https.onRequest(faqParser);
exports.hospitalsParser = functions.https.onRequest(hospitalsParser);
exports.advicesParser = functions.https.onRequest(advicesParser);
