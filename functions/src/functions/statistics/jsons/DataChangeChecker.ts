import equal = require('deep-equal');
import Statistic from "../repository/Statistic";
import VoivodeshipViewModel from "../model/VoivodeshipViewModel";

const checkExistsNewestData = (voivodeships: Array<VoivodeshipViewModel>, lastStatistic: Statistic | null) => {

    if (!lastStatistic) {
        return true;
    }

    return !equal(lastStatistic.covidInfo.voivodeships, voivodeships);
};

export default checkExistsNewestData;
