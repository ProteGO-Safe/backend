import Voivodeship from "../repository/Voivodeship";
import District from "../repository/District";
import DistrictState from "../DistrictState";
import DistrictViewModel from "../model/DistrictViewModel";
import VoivodeshipViewModel from "../model/VoivodeshipViewModel";

const createDistricts = (
    voivodeshipId: string,
    districts: District[],
    districtStates: DistrictState[]
): Array<DistrictViewModel> => {
    return districts
        .filter(district => district.voivodeshipId === voivodeshipId)
        .map(district => {
            const state = districtStates.find(value => value.districtId === district.id)!.state;
            return {
                id: district.uiId,
                name: district.name,
                state
            }
        })
};

const createVoivodeships = (
    voivodeships: Voivodeship[],
    districts: District[],
    districtStates: DistrictState[]
): Array<VoivodeshipViewModel> => {
    return voivodeships.map(voivodeship => {
        return {
            id: voivodeship.uiId,
            name: voivodeship.name,
            districts: createDistricts(voivodeship.id, districts, districtStates)
        }
    })
};

export default createVoivodeships;
