import {fetchIndexByTitle, parseFile} from "./StatistiscHelper";
import DistrictState from "./DistrictState";
import District from "./repository/District";
import Statistic from "./repository/Statistic";

const TITLE_EXTERNAL_ID = 'teryt';
const TITLE_STATE = 'strefa';

const fetchDistrictsStates = async (
    districts: Array<District> | [],
    districtStatesFileContent: string | null,
    lastStatistic: Statistic | null
): Promise<Array<DistrictState>> => {

    if (districtStatesFileContent) {
        const parsed = await parseFile(districtStatesFileContent);
        return createDistrictsStates(districts, parsed);
    }

    return createDistrictsStatesFromStatistics(districts, lastStatistic!);
};

const createDistrictsStates = (
    allDistricts: Array<District>,
    districtsStates: Array<Array<string>>,
): Array<DistrictState> => {

    const districtsExternalIdIndex = fetchIndexByTitle(districtsStates[0], TITLE_EXTERNAL_ID);
    const districtsStateIndex = fetchIndexByTitle(districtsStates[0], TITLE_STATE);

    return districtsStates
        .filter((value, index) => index !== 0)
        .map(value => {
            const id = allDistricts.find(value1 => value1.externalId === value[districtsExternalIdIndex])!.id;
            return {
                districtId: id,
                state: parseInt(value[districtsStateIndex])
            }
        });
};

const createDistrictsStatesFromStatistics = (
    allDistricts: Array<District> | [],
    statistic: Statistic
): Array<DistrictState> => {

    const districtStates = statistic.details.voivodeships.reduce((obj: any, item: any) => {
        return [...obj, ...item.districts]
    }, []);


    return (allDistricts as District[]).map(value => {
        return {
            districtId: value.id,
            state: districtStates.find(districtState => districtState.id === value.id).state
        }
    })
};


export default fetchDistrictsStates;