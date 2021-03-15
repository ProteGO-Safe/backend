import NewData from "../NewData";
import TotalVaccinationsData from "../TotalVaccinationsData";

interface DistrictDetailsViewModel extends NewData, TotalVaccinationsData {
    id: string,
    name: string,
    state: number | null,
    newDeathsWithComorbidities: number | null,
    newDeathsWithoutComorbidities: number | null,
    newTests: number | null,
}

export default DistrictDetailsViewModel;