import CovidStatsViewModel from "./CovidStatsViewModel";
import VoivodeshipViewModel from "./VoivodeshipViewModel";

interface CovidInfoJsonViewModel {
    updated: number,
    voivodeshipsUpdated: number,
    covidStats: CovidStatsViewModel,
    voivodeships: Array<VoivodeshipViewModel>,
}

export default CovidInfoJsonViewModel;