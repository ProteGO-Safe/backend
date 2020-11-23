import * as functions from "firebase-functions";
import {validateApiTokenAndIp} from "../../ipAndApiTokenValidator";
import {generateCode} from "../../code/codeGenerator";
import returnBadRequestResponse from "../../returnBadRequestResponse";
import moment = require("moment");

const {log} = require("firebase-functions/lib/logger");
const DELETE_LIFETIME = 48 * 60 * 60;

const generateSubscriptionCode = async (request: functions.Request, response: functions.Response) => {

    try {
        const isValid = await validateApiTokenAndIp(request);

        if (!isValid) {
            return returnBadRequestResponse(response);
        }

        const {code, id} = await generateCode(moment().unix() + DELETE_LIFETIME);

        log(`generated lab test code, return code: 201`);

        return response.status(201).send({id, code});
    } catch (e) {
        log(e);
        return returnBadRequestResponse(response);
    }
};

export default generateSubscriptionCode;
