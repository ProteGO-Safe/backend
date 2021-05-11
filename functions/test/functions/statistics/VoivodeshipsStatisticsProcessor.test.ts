import {expect} from "chai";
import fetchVoivodeshipsStatistics from "../../../src/functions/statistics/VoivodeshipStatisticsProcessor";

describe('VoivodeshipsStatisticsProcessor tests', () => {
    it('should fetch districts statistics', async () => {
        const rcbVoivodeshipsFileContent = 'wojewodztwo;liczba_przypadkow;liczba_na_10_tys_mieszkancow;zgony;zgony_w_wyniku_covid_bez_chorob_wspolistniejacych;zgony_w_wyniku_covid_i_chorob_wspolistniejacych;liczba_zlecen_poz;liczba_ozdrowiencow;liczba_osob_objetych_kwarantanna;liczba_wykonanych_testow;liczba_testow_z_wynikiem_pozytywnym;liczba_testow_z_wynikiem_negatywnym;liczba_pozostalych_testow;teryt;stan_rekordu_na\n' +
            'Cały kraj;13574;3.54;126;25;101;656;11146;227988;49997;14430;34632;935;t00;2021-03-06\n' +
            'dolnośląskie;909;3.14;2;2;0;48;744;13500;2829;955;1835;39;t02;2021-03-06\n' +
            'zachodniopomorskie;372;2.20;5;0;5;12;382;8264;1802;408;1357;37;t32;2021-03-06\n';

        const rcbVoivodeshipVaccinationsFileContent = 'wojewodztwo;liczba_szczepien_ogolnie;liczba_szczepien_dziennie;dawka_2_ogolem;dawka_2_dziennie;teryt\n' +
            'inne_puste_woj;419;13;1;0;\n' +
            'dolnośląskie;176112;7814;54311;3465;t02\n' +
            'zachodniopomorskie;87502;4659;24222;2248;t32\n';

        const voivodeships = [
            {
                id: "id1",
                externalId: "t02",
                uiId: 1,
                name: "dolnośląskie"
            },
            {
                id: "id2",
                externalId: "t32",
                uiId: 2,
                name: "zachodniopomorskie"
            }];

        const districtsStatistics = await fetchVoivodeshipsStatistics(voivodeships, rcbVoivodeshipsFileContent, rcbVoivodeshipVaccinationsFileContent);

        expect(districtsStatistics).to.be.eql([
            {
                voivodeshipId: "id1",
                newCases: 909,
                newDeaths: 2,
                newDeathsWithComorbidities: 0,
                newDeathsWithoutComorbidities: 2,
                newRecovered: 744,
                newTests: 2829,
                newVaccinations: 7814,
                newVaccinationsDose1: 7814-3465,
                newVaccinationsDose2: 3465,
                totalVaccinations: 176112,
                totalVaccinationsDose1: 176112-54311,
                totalVaccinationsDose2: 54311,
            },
            {
                voivodeshipId: "id2",
                newCases: 372,
                newDeaths: 5,
                newDeathsWithComorbidities: 5,
                newDeathsWithoutComorbidities: 0,
                newRecovered: 382,
                newTests: 1802,
                newVaccinations: 4659,
                newVaccinationsDose1: 4659-2248,
                newVaccinationsDose2: 2248,
                totalVaccinations: 87502,
                totalVaccinationsDose1: 87502-24222,
                totalVaccinationsDose2: 24222,
            }
        ]);
    });
});
