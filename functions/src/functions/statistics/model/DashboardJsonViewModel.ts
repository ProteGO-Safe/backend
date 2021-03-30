import TotalData from "../TotalData";
import DailyData from "../DailyData";

interface DashboardJsonViewModel extends DailyData, TotalData {
    updated: number,
    totalUndesirableReaction: number
}

export default DashboardJsonViewModel;