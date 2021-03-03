import {expect} from "chai";
import fetchGlobalStatistics from "../../../src/functions/statistics/GlobalStatisticsProcessor";

describe('GlobalStatisticsProcessor tests', () => {
    it('should fetch global statistics', async () => {
        const rcbGlobalFileContent = 'sumaryczna_ilosc_zakazen_od_poczatku_pandemii;sumaryczna_ilosc_przypadkow_smiertelnych;liczba_zgonow_kobiet;liczba_zgonow_mezczyzn;zgony_0-10;zgony_11-20;zgony_21-30;zgony_31-40;zgony_41-50;zgony_51-60;zgony_61-70;zgony_71-80;zgony_81;sumaryczna_liczba_ozdrowiencow;stan_rekordu_na\n' +
            '1577036;40424;108;139;0;0;1;3;6;16;52;86;83;1330127;2021-02-11\n';
        const rcbGlobalVaccinationsFileContent = 'liczba_szczepien_ogolem;liczba_szczepien_dziennie;dawka_2_ogolem;dawka_2_dziennie;szczepienia_plec_nieustalono;szczepienia_kobiety;szczepienia_mezczyzni;szczepienia0_17;szczepienia18_30;szczepienia31_40;szczepienia41_50;szczepienia51_60;szczepienia61_70;szczepienia71_75;szczepienia75_;szczepienia_wiek_nieustalono;dawka_1_suma\n' +
            '1993739;105253;580607;53712;3245;1369401;621093;0;201447;227003;313021;348275;228638;118337;553004;4014;1413132\n';
        const rcbGlobalVaccinationsOtherFileContent = 'odczyny_niepozadane;dawki_utracone;stan_magazyn;liczba_dawek_punkty;suma_dawek_polska\n' +
            '1683;3630;98500;2334140;2432640\n';

        const globalStatistics = await fetchGlobalStatistics(rcbGlobalFileContent, rcbGlobalVaccinationsFileContent, rcbGlobalVaccinationsOtherFileContent);

        expect(globalStatistics).to.be.eql({
            totalCases: 1577036,
            totalDeaths: 40424,
            totalRecovered: 1330127,
            totalUndesirableReaction: 1683,
            totalVaccinations: 1993739,
            totalVaccinationsDose1: 1413132,
            totalVaccinationsDose2: 580607,
        });
    });
});
