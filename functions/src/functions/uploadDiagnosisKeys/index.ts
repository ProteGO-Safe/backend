import {sign} from "jsonwebtoken";
import config, {secretManager} from "../../config";
import Axios from "axios";

const superagent = require('superagent');

const uploadDiagnosisKeys = (data: any): Promise<any> => {
    const idToken = getIdToken();
    return superagent
        .post(config.exposureEndpoint)
        .send(data)
        .set('Authorization', `Bearer ${idToken}`);


    async function getIdToken(): Promise<string> {
        const serverConfig = await secretManager.getConfig('exposureServerConfig');

        const jwt = sign(
            {
                target_audience: config.exposureEndpoint
            },
            <string>serverConfig.private_key,
            {
                algorithm: 'RS256',
                expiresIn: '60 minutes',
                audience: serverConfig.token_uri,
                issuer: serverConfig.client_email
            }
        );

        const response = await Axios.post(serverConfig.token_uri, {
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: jwt
        });

        return <string>response.data.id_token;
    }
}

export default uploadDiagnosisKeys;
