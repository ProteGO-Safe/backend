import DistrictDetailsViewModel from "./DistrictDetailsViewModel";

interface VoivodeshipDetailsViewModel {
    id: string,
    name: string,
    districts: Array<DistrictDetailsViewModel>,
}

export default VoivodeshipDetailsViewModel;