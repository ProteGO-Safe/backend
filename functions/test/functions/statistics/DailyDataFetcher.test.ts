import {expect} from "chai";
import fetchDailyData from "../../../src/functions/statistics/DailyDataFetcher";

describe('DailyDataFetcher tests', () => {
    it('should fetch daily data', async () => {

        const rcbDistrictsFileContent = "wojewodztwo;powiat_miasto;liczba_przypadkow;liczba_na_10_tys_mieszkancow;zgony;zgony_w_wyniku_covid_bez_chorob_wspolistniejacych;zgony_w_wyniku_covid_i_chorob_wspolistniejacych;liczba_zlecen_poz;liczba_ozdrowiencow;liczba_osob_objetych_kwarantanna;liczba_wykonanych_testow;liczba_testow_z_wynikiem_pozytywnym;liczba_testow_z_wynikiem_negatywnym;liczba_pozostalych_testow;teryt;stan_rekordu_na\n" +
            "Cały kraj;Cały kraj;13574;3.54;126;25;101;656;11146;227988;49997;14430;34632;935;t0000;2021-03-06\n" +
            "dolnośląskie;bolesławiecki;6;0.67;0;0;0;0;6;160;48;6;42;0;t0201;2021-03-06\n" +
            "dolnośląskie;dzierżoniowski;31;3.08;0;0;0;1;11;249;88;31;54;3;t0202;2021-03-06\n" +
            "dolnośląskie;głogowski;24;2.70;0;0;0;2;21;333;97;24;71;2;t0203;2021-03-06";

        const rcbGlobalVaccinationsFileContent = "liczba_szczepien_ogolem;liczba_szczepien_dziennie;dawka_2_ogolem;dawka_2_dziennie;szczepienia_plec_nieustalono;szczepienia_kobiety;szczepienia_mezczyzni;szczepienia0_17;szczepienia18_30;szczepienia31_40;szczepienia41_50;szczepienia51_60;szczepienia61_70;szczepienia71_75;szczepienia75_;szczepienia_wiek_nieustalono;dawka_1_suma\n" +
            "1993739;105253;580607;53712;3245;1369401;621093;0;201447;227003;313021;348275;228638;118337;553004;4014;1413132\n";

        const dailyData = await fetchDailyData(rcbDistrictsFileContent, rcbGlobalVaccinationsFileContent);

        expect(dailyData).to.be.eql({
            newCases: 13574,
            newDeaths: 126,
            newRecovered: 11146,
            newDeathsWithComorbidities: 101,
            newDeathsWithoutComorbidities: 25,
            newTests: 49997,
            newVaccinations: 105253,
            newVaccinationsDose1: 105253-53712,
            newVaccinationsDose2: 53712
        });
    });
});
