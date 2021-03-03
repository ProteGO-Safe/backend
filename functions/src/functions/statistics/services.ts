import DistrictRepository from "./repository/DistrictRepository";
import StatisticsFileReader from "./StatisticsFileReader";
import {secretManager} from "../../services";
import VoivodeshipRepository from "./repository/VoivodeshipRepository";
import StatisticsRepository from "./repository/StatisticsRepository";
import StatisticFileRepository from "./repository/StatisticFileRepository";

export const statisticsFileReader = new StatisticsFileReader(secretManager);
export const districtRepository = new DistrictRepository();
export const voivodeshipRepository = new VoivodeshipRepository();
export const statisticsRepository = new StatisticsRepository();
export const statisticFileRepository = new StatisticFileRepository();
