import TotalVaccinationsData from "./TotalVaccinationsData";

interface TotalData extends TotalVaccinationsData {
    totalCases: number,
    totalDeaths: number,
    totalRecovered: number,
}

export default TotalData;