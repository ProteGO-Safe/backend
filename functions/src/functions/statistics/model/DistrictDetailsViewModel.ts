import NewData from "../NewData";
import TotalVaccinationsData from "../TotalVaccinationsData";

interface DistrictDetailsViewModel extends NewData, TotalVaccinationsData {
    id: string,
    name: string,
    state: number,
    newDeathsWithComorbidities: number,
    newDeathsWithoutComorbidities: number,
    newTests: number,
}

export default DistrictDetailsViewModel;