import TotalVaccinationsData from "../TotalVaccinationsData";
import NewData from "../NewData";

interface RegionDetailsViewModel extends NewData, TotalVaccinationsData {
    newDeathsWithComorbidities: number,
    newDeathsWithoutComorbidities: number,
    newTests: number,
}

export default RegionDetailsViewModel;