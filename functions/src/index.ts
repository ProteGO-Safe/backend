import * as admin from "firebase-admin";
import * as cloudFunctions from "./cloudFunctions";
import generateCode from "./functions/generateCode";
import {clearUnusedCodes} from "./functions/clearUnusedCodes";
import uploadDiagnosisKeys from "./functions/uploadDiagnosisKeys";
import faqParser from "./functions/faqParser";

admin.initializeApp();

exports.generateCode = cloudFunctions.https(generateCode);
exports.uploadDiagnosisKeys = cloudFunctions.https(uploadDiagnosisKeys);
exports.clearUnusedCodes = cloudFunctions.scheduler(clearUnusedCodes, 'every 30 minutes');
exports.faqParser = cloudFunctions.scheduler(faqParser, 'every 30 minutes');
