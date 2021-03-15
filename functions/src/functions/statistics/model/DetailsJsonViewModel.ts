import VoivodeshipDetailsViewModel from "./VoivodeshipDetailsViewModel";
import LastDaysJsonViewModel from "./LastDaysJsonViewModel";

interface DetailsJsonViewModel {
    updated: number,
    voivodeships: Array<VoivodeshipDetailsViewModel>,
    lastDays: LastDaysJsonViewModel
}

export default DetailsJsonViewModel;