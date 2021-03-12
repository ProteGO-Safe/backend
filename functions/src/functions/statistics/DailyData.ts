import NewData from "./NewData";

interface DailyData extends NewData {
    newDeathsWithComorbidities: number,
    newDeathsWithoutComorbidities: number,
    newTests: number,
}

export default DailyData;