import NewData from "../NewData";
import TotalData from "../TotalData";

interface CovidStatsViewModel extends NewData, TotalData {
    updated: number,
}

export default CovidStatsViewModel;