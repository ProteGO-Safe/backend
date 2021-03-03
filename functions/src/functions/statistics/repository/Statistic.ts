import Entity from "../../repository/Entity";
import CovidInfoJsonViewModel from "../model/CovidInfoJsonViewModel";
import DashboardJsonViewModel from "../model/DashboardJsonViewModel";
import DetailsJsonViewModel from "../model/DetailsJsonViewModel";
import DistrictsJsonViewModel from "../model/DistrictsJsonViewModel";
import DailyData from "../DailyData";

interface Statistic extends Entity {
    date: Date,
    covidInfo: CovidInfoJsonViewModel
    dashboard: DashboardJsonViewModel,
    details: DetailsJsonViewModel,
    districts: DistrictsJsonViewModel,
    dailyData: DailyData,
    published: boolean
}

export default Statistic;