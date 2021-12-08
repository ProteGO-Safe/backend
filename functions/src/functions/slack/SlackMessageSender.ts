import Axios from "axios";
import {secretManager} from "../../services";
import SlackMessage from "./SlackMessage";

const sendSlackMessage = async (slackMessage: SlackMessage) => {

    const {webhookUrl} = await secretManager.getConfig('slack');

    const messageBody = resolveMessageBody(slackMessage);

    await Axios.post(webhookUrl, messageBody, {
        headers: {
            "Content-Type": "application/json"
        },
    });
};

const resolveMessageBody = (slackMessage: SlackMessage) => {

    if (slackMessage.detailsItems === undefined || slackMessage.detailsItems.length === 0) {
        return {
            "text": slackMessage.title
        };
    }

    return {
        "text": slackMessage.title,
        "attachments": [
            {
                "color": slackMessage.color,
                "fields": slackMessage.detailsItems.map(value => {
                    return {
                        "title": value.title,
                        "value": value.value,
                        "short": true
                    }
                })
            }
        ]
    };

};


export default sendSlackMessage;