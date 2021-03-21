import DistrictViewModel from "./DistrictViewModel";

interface VoivodeshipViewModel {
    id: number,
    name: string,
    districts: Array<DistrictViewModel>,
}

export default VoivodeshipViewModel;