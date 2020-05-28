import {CallableContext} from "firebase-functions/lib/providers/https";
import config, {secretManager} from "../config";
import * as functions from "firebase-functions";
import {v4} from 'uuid';
import {sign} from "jsonwebtoken";
import moment = require("moment");

export async function getAccessToken(data : any) {
    if (!data.code) {
        throw new functions.https.HttpsError('not-found', 'Invalid code');
    }

    const repository = config.code.repository;
    const code = await repository.get(data.code);

    if (!code.exists) {
        throw new functions.https.HttpsError('not-found', 'Invalid code');
    }

    await repository.remove(data.code);

    if (code.get('expiryTime') < moment().unix()) {
        throw new functions.https.HttpsError('not-found', 'Invalid code');
    }

    const accessToken = sign(
        {code: data.code},
        await secretManager.getConfig('secret'),
        {
            algorithm: 'HS512',
            expiresIn: `${config.jwt.lifetime} minutes`,
            jwtid: v4()
        }
    );

    return {accessToken: accessToken};
}
