import {getTimestamp} from "../../../utils/dateUtils";
import Voivodeship from "../repository/Voivodeship";
import District from "../repository/District";
import DistrictState from "../DistrictState";
import Statistic from "../repository/Statistic";
import checkExistsNewestData from "./DataChangeChecker";
import DistrictsJsonViewModel from "../model/DistrictsJsonViewModel";
import createVoivodeships from "./VoivodeshipViewModelFactory";

const createDistrictsJson = (
    date: Date,
    voivodeships: Voivodeship[],
    districts: District[],
    districtStates: DistrictState[],
    lastStatistic: Statistic | null,
): DistrictsJsonViewModel => {

    const createdVoivodeships = createVoivodeships(voivodeships, districts, districtStates);

    const existsNewestData = checkExistsNewestData(createdVoivodeships, lastStatistic);

    if (existsNewestData) {
        const timestamp = getTimestamp(date);
        return {
            updated: timestamp,
            voivodeships: createdVoivodeships
        }
    }

    return {
        updated: lastStatistic!.districts.updated,
        voivodeships: lastStatistic!.districts.voivodeships
    }
};

export default createDistrictsJson;
