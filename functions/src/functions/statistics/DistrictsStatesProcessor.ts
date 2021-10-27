import DistrictState from "./DistrictState";
import District from "./repository/District";
import Statistic from "./repository/Statistic";
import File from "./File"

const TITLE_EXTERNAL_ID = 'teryt';
const TITLE_STATE = 'strefa';

const fetchDistrictsStates = (
    districts: Array<District> | [],
    districtStatesFile: File | null,
    lastStatistic: Statistic | null
): Array<DistrictState> => {

    if (districtStatesFile) {
        return createDistrictsStates(districts, districtStatesFile);
    }

    return createDistrictsStatesFromStatistics(districts, lastStatistic!);
};

const createDistrictsStates = (
    allDistricts: Array<District>,
    districtStatesFile: File,
): Array<DistrictState> => {

    return districtStatesFile.listIdAndValue(TITLE_EXTERNAL_ID, TITLE_STATE, (externalId: string, value: number) => {
        // tslint:disable-next-line:no-shadowed-variable
        const id = allDistricts.find(value => value.externalId === externalId)!.id;
        return {
            districtId: id,
            state: value
        }
    })
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