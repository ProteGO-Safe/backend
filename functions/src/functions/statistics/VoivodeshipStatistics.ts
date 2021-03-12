import DailyData from "./DailyData";
import NewData from "./NewData";
import TotalVaccinationsData from "./TotalVaccinationsData";

interface VoivodeshipStatistics extends DailyData, NewData, TotalVaccinationsData {
    voivodeshipId: string,
}

export default VoivodeshipStatistics;
