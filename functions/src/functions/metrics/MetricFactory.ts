import {v4} from "uuid";
import Metric from "./Metric";
import moment = require("moment");

const createMetric = (data: any, type: string): Metric => {

    return {
        id: v4(),
        createdAt: moment().unix(),
        data,
        type
    }
};

export default createMetric;
