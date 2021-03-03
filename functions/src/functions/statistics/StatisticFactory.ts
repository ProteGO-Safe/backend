import {v4} from "uuid";
import CovidInfoJsonViewModel from "./model/CovidInfoJsonViewModel";
import Statistic from "./repository/Statistic";
import DashboardJsonViewModel from "./model/DashboardJsonViewModel";
import DetailsJsonViewModel from "./model/DetailsJsonViewModel";
import DistrictsJsonViewModel from "./model/DistrictsJsonViewModel";
import DailyData from "./DailyData";


export const createStatistic = (
    date: Date,
    covidInfoJson: CovidInfoJsonViewModel,
    dashboardJson: DashboardJsonViewModel,
    detailsJson: DetailsJsonViewModel,
    districtsJson: DistrictsJsonViewModel,
    dailyData: DailyData
    ): Statistic => {

    return {
        id: v4(),
        date,
        covidInfo: covidInfoJson,
        dashboard: dashboardJson,
        details: detailsJson,
        districts: districtsJson,
        dailyData,
        published: false
    }
};
