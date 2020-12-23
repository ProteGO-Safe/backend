import {sign} from "jsonwebtoken";
import {secretManager} from "../../services";
import Axios from "axios";

const superagent = require('superagent');

const uploadDiagnosisKeys = async (data: any): Promise<any> => {
    const exposureEndpoint = await secretManager.getConfig('exposureEndpoint');
    const idToken = await getIdToken(exposureEndpoint);
    return superagent
        .post(exposureEndpoint)
        .timeout(10000) // 10 seconds
        .send(data)
        .set('Authorization', `Bearer ${idToken}`);
};

const getIdToken = async (exposureEndpoint: string): Promise<string> => {
    const serverConfig = await secretManager.getConfig('exposureServerConfig');

    const jwt = sign(
        {
            target_audience: exposureEndpoint
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
};

export default uploadDiagnosisKeys;
