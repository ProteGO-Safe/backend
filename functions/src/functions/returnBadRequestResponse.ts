import * as functions from "firebase-functions";

const returnBadRequestResponse = (response: functions.Response) => {
    response.status(400).send();
};

export default returnBadRequestResponse;
