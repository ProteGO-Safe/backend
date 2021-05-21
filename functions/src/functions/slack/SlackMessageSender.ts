import Axios from "axios";
import {secretManager} from "../../services";
import SlackMessage from "./SlackMessage";

const sendSlackMessage = async (slackMessage: SlackMessage) => {

    const {webhookUrl} = await secretManager.getConfig('slack');

    const fields = slackMessage.detailsItems.length === 0 ? [{
        "title": "empty",
        "value": "empty",
        "short": true
    }] : slackMessage.detailsItems.map(value => {
        return {
            "title": value.title,
            "value": value.value,
            "short": true
        }
    });


    const messageBody = {
        "text": slackMessage.title,
        "attachments": [
            {
                "color": slackMessage.color,
                "fields": fields
            }
        ]
    };

    await Axios.post(webhookUrl, messageBody, {
        headers: {
            "Content-Type": "application/json"
        },
    });
};


export default sendSlackMessage;