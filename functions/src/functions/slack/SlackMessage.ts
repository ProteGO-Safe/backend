import {Color} from "../colors";
import SlackMessageDetailsItem from "./SlackMessageDetailsItem";

interface SlackMessage {
    title: string,
    color: Color,
    detailsItems: SlackMessageDetailsItem[]
}

export default SlackMessage;