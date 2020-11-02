import {v4} from 'uuid';
import {sign} from "jsonwebtoken";

export const generateJwt = (payload: any, secret: string, lifetime: number): any => {

    return sign(payload, secret, {
            algorithm: 'HS512',
            expiresIn: `${lifetime} minutes`,
            jwtid: v4()
        }
    );
};
