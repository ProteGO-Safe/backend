import TotalVaccinationsData from "../TotalVaccinationsData";
import NewData from "../NewData";

interface RegionDetailsViewModel extends NewData, TotalVaccinationsData {
    newDeathsWithComorbidities: number | null,
    newDeathsWithoutComorbidities: number | null,
    newTests: number | null,
}

export default RegionDetailsViewModel;