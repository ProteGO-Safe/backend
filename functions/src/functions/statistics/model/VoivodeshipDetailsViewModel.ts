import DistrictDetailsViewModel from "./DistrictDetailsViewModel";
import RegionDetailsViewModel from "./RegionDetailsViewModel";

interface VoivodeshipDetailsViewModel {
    id: string,
    name: string,
    details: RegionDetailsViewModel,
    districts: Array<DistrictDetailsViewModel>,
}

export default VoivodeshipDetailsViewModel;