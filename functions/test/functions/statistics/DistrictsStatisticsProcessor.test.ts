import {expect} from "chai";
import fetchDistrictsStatistics from "../../../src/functions/statistics/DistrictStatisticsProcessor";

describe('DistrictStatisticsProcessor tests', () => {
    it('should fetch districts statistics', async () => {
        const rcbDistrictsFileContent = 'wojewodztwo;powiat_miasto;liczba_przypadkow;liczba_na_10_tys_mieszkancow;zgony;zgony_w_wyniku_covid_bez_chorob_wspolistniejacych;zgony_w_wyniku_covid_i_chorob_wspolistniejacych;liczba_zlecen_poz;liczba_ozdrowiencow;liczba_osob_objetych_kwarantanna;liczba_wykonanych_testow;liczba_testow_z_wynikiem_pozytywnym;liczba_testow_z_wynikiem_negatywnym;liczba_pozostalych_testow;teryt;stan_rekordu_na\n' +
            'Cały kraj;Cały kraj;6379;1.66;247;46;201;11529;6326;149615;48897;7077;41122;698;t0000;2021-02-11\n' +
            'dolnośląskie;bolesławiecki;3;0.33;2;0;2;12;13;213;125;3;122;0;t0201;2021-02-11\n' +
            'dolnośląskie;dzierżoniowski;18;1.79;0;0;0;21;1;139;131;21;109;1;t0202;2021-02-11\n' +
            'dolnośląskie;milicki;38;10.29;1;1;0;50;20;752;83;39;43;1;t0213;2021-02-11\n' +
            'dolnośląskie;głogowski;11;1.24;0;0;0;17;14;136;78;11;67;0;t0203;2021-02-11';
        const rcbDistrictVaccinationsFileContent = 'wojewodztwo;powiat_miasto;liczba_szczepien_ogolnie;liczba_szczepien_dziennie;dawka_2_ogolem;dawka_2_dziennie;teryt\n' +
            'woj_puste;pow_puste;419;13;1;0;t00\n' +
            'dolnośląskie;bolesławiecki;5117;102;1623;64;t0201\n' +
            'dolnośląskie;dzierżoniowski;3855;346;893;234;t0202\n' +
            'dolnośląskie;milicki;3855;346;893;234;t0213\n' +
            'dolnośląskie;głogowski;3172;172;726;84;t0203';

        const districts = [
            {
                id: "id1",
                externalId: "t0201",
                voivodeshipId: "v1",
                uiId: 1,
                name: "bolesławiecki"
            },
            {
                id: "id2",
                externalId: "t0202",
                voivodeshipId: "v1",
                uiId: 2,
                name: "dzierżoniowski"
            },
            {
                id: "id3",
                externalId: "t0203",
                voivodeshipId: "v1",
                uiId: 3,
                name: "głogowski"
            },
            {
                id: "id4",
                externalId: "t0213",
                voivodeshipId: "v1",
                uiId: 4,
                name: "milicki"
            }];

        const districtsStatistics = await fetchDistrictsStatistics(districts, rcbDistrictsFileContent, rcbDistrictVaccinationsFileContent);

        expect(districtsStatistics).to.be.eql([
            {
                districtId: "id1",
                newCases: 3,
                newDeaths: 2,
                newDeathsWithComorbidities: 2,
                newDeathsWithoutComorbidities: 0,
                newRecovered: 13,
                newTests: 125,
                newVaccinations: 102,
                newVaccinationsDose1: 38,
                newVaccinationsDose2: 64,
                totalVaccinations: 5117,
                totalVaccinationsDose1: 3494,
                totalVaccinationsDose2: 1623,
                voivodeshipId: "v1"
            },
            {
                districtId: "id2",
                newCases: 18,
                newDeaths: 0,
                newDeathsWithComorbidities: 0,
                newDeathsWithoutComorbidities: 0,
                newRecovered: 1,
                newTests: 131,
                newVaccinations: 346,
                newVaccinationsDose1: 112,
                newVaccinationsDose2: 234,
                totalVaccinations: 3855,
                totalVaccinationsDose1: 2962,
                totalVaccinationsDose2: 893,
                voivodeshipId: "v1"
            },
            {
                districtId: "id3",
                newCases: 11,
                newDeaths: 0,
                newDeathsWithComorbidities: 0,
                newDeathsWithoutComorbidities: 0,
                newRecovered: 14,
                newTests: 78,
                newVaccinations: 172,
                newVaccinationsDose1: 88,
                newVaccinationsDose2: 84,
                totalVaccinations: 3172,
                totalVaccinationsDose1: 2446,
                totalVaccinationsDose2: 726,
                voivodeshipId: "v1"
            },
            {
                districtId: "id4",
                newCases: 38,
                newDeaths: 1,
                newDeathsWithComorbidities: 0,
                newDeathsWithoutComorbidities: 1,
                newRecovered: 20,
                newTests: 83,
                newVaccinations: 346,
                newVaccinationsDose1: 112,
                newVaccinationsDose2: 234,
                totalVaccinations: 3855,
                totalVaccinationsDose1: 2962,
                totalVaccinationsDose2: 893,
                voivodeshipId: "v1"
            }
        ]);
    });
});
