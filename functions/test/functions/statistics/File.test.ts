import {expect} from "chai";
import File from "../../../src/functions/statistics/File";

describe('File tests', () => {
    it('should get first row value from file', async () => {

        const fileContent = 'sumaryczna_ilosc_zakazen_od_poczatku_pandemii;sumaryczna_ilosc_przypadkow_smiertelnych;liczba_zgonow_kobiet;liczba_zgonow_mezczyzn;zgony_0-10;zgony_11-20;zgony_21-30;zgony_31-40;zgony_41-50;zgony_51-60;zgony_61-70;zgony_71-80;zgony_81;sumaryczna_liczba_ozdrowiencow;stan_rekordu_na\n' +
            '1577036;40424;108;139;0;0;1;3;6;16;52;86;83;1330127;2021-02-11\n';

        const file = new File("", fileContent);

        expect(file.getFirstRowValue("sumaryczna_ilosc_zakazen_od_poczatku_pandemii")).to.be.eql(1577036);
        expect(file.getFirstRowValue("sumaryczna_ilosc_przypadkow_smiertelnych")).to.be.eql(40424);
        expect(file.getFirstRowValue("liczba_zgonow_kobiet")).to.be.eql(108);
        expect(file.getFirstRowValue("liczba_zgonow_mezczyzn")).to.be.eql(139);
        expect(file.getFirstRowValue("zgony_0-10")).to.be.eql(0);
        expect(file.getFirstRowValue("sumaryczna_liczba_ozdrowiencow")).to.be.eql(1330127);
    });

    it('should throw exception when data has more than two lines', async () => {

        const fileContent = 'sumaryczna_ilosc_zakazen_od_poczatku_pandemii;sumaryczna_ilosc_przypadkow_smiertelnych;liczba_zgonow_kobiet;liczba_zgonow_mezczyzn;zgony_0-10;zgony_11-20;zgony_21-30;zgony_31-40;zgony_41-50;zgony_51-60;zgony_61-70;zgony_71-80;zgony_81;sumaryczna_liczba_ozdrowiencow;stan_rekordu_na\n' +
            '1577036;40424;108;139;0;0;1;3;6;16;52;86;83;1330127;2021-02-11\n' +
            '1577036;40424;108;139;0;0;1;3;6;16;52;86;83;1330127;2021-02-11\n';

        const file = new File("", fileContent);

        const testedFunction = () => file.getFirstRowValue("sumaryczna_ilosc_zakazen_od_poczatku_pandemii");

        expect(testedFunction).to.throw(Error);
        expect(testedFunction).to.throw("illegal rcbGlobalStats content");
    });

    it('should get value based on row and column from file', async () => {

        const fileContent = "wojewodztwo;powiat_miasto;liczba_przypadkow;liczba_na_10_tys_mieszkancow;zgony;zgony_w_wyniku_covid_bez_chorob_wspolistniejacych;zgony_w_wyniku_covid_i_chorob_wspolistniejacych;liczba_zlecen_poz;liczba_ozdrowiencow;liczba_osob_objetych_kwarantanna;liczba_wykonanych_testow;liczba_testow_z_wynikiem_pozytywnym;liczba_testow_z_wynikiem_negatywnym;liczba_pozostalych_testow;teryt;stan_rekordu_na\n" +
            "Cały kraj;Cały kraj;13574;3.54;126;25;101;656;11146;227988;49997;14430;34632;935;t0000;2021-03-06\n" +
            "dolnośląskie;bolesławiecki;6;0.67;0;0;0;0;6;160;48;6;42;0;t0201;2021-03-06\n" +
            "dolnośląskie;dzierżoniowski;31;3.08;0;0;0;1;11;249;88;31;54;3;t0202;2021-03-06\n" +
            "dolnośląskie;głogowski;24;2.70;0;0;0;2;21;333;97;24;71;2;t0203;2021-03-06";

        const file = new File("", fileContent);

        expect(file.getValue("liczba_przypadkow", "Cały kraj")).to.be.eql(13574);
    });

    it('should get value based on id from file', async () => {

        const fileContent = "wojewodztwo;powiat_miasto;liczba_przypadkow;liczba_na_10_tys_mieszkancow;zgony;zgony_w_wyniku_covid_bez_chorob_wspolistniejacych;zgony_w_wyniku_covid_i_chorob_wspolistniejacych;liczba_zlecen_poz;liczba_ozdrowiencow;liczba_osob_objetych_kwarantanna;liczba_wykonanych_testow;liczba_testow_z_wynikiem_pozytywnym;liczba_testow_z_wynikiem_negatywnym;liczba_pozostalych_testow;teryt;stan_rekordu_na\n" +
            "Cały kraj;Cały kraj;13574;3.54;126;25;101;656;11146;227988;49997;14430;34632;935;t0000;2021-03-06\n" +
            "dolnośląskie;bolesławiecki;6;0.67;0;0;0;0;6;160;48;6;42;0;t0201;2021-03-06\n" +
            "dolnośląskie;dzierżoniowski;31;3.08;0;0;0;1;11;249;88;31;54;3;t0202;2021-03-06\n" +
            "dolnośląskie;głogowski;24;2.70;0;0;0;2;21;333;97;24;71;2;t0203;2021-03-06";

        const file = new File("", fileContent);

        expect(file.getValueById("teryt", "t0203", "liczba_przypadkow")).to.be.eql(24);
    });

    it('should get list based on id from file', async () => {

        const fileContent = "wojewodztwo;powiat_miasto;liczba_przypadkow;liczba_na_10_tys_mieszkancow;zgony;zgony_w_wyniku_covid_bez_chorob_wspolistniejacych;zgony_w_wyniku_covid_i_chorob_wspolistniejacych;liczba_zlecen_poz;liczba_ozdrowiencow;liczba_osob_objetych_kwarantanna;liczba_wykonanych_testow;liczba_testow_z_wynikiem_pozytywnym;liczba_testow_z_wynikiem_negatywnym;liczba_pozostalych_testow;teryt;stan_rekordu_na\n" +
            "Cały kraj;Cały kraj;13574;3.54;126;25;101;656;11146;227988;49997;14430;34632;935;t0000;2021-03-06\n" +
            "dolnośląskie;bolesławiecki;6;0.67;0;0;0;0;6;160;48;6;42;0;t0201;2021-03-06\n" +
            "dolnośląskie;dzierżoniowski;31;3.08;0;0;0;1;11;249;88;31;54;3;t0202;2021-03-06\n" +
            "dolnośląskie;głogowski;24;2.70;0;0;0;2;21;333;97;24;71;2;t0203;2021-03-06";

        const file = new File("", fileContent);

        const listedDatas = file.listIdAndValue("teryt", "liczba_na_10_tys_mieszkancow", (externalId: string, value: number) => {
            return {
                externalId,
                value
            }
        });

        expect(listedDatas).to.be.eql([
            {
                externalId: "t0000",
                value: 3
            },
            {
                externalId: "t0201",
                value: 0
            },
            {
                externalId: "t0202",
                value: 3
            },
            {
                externalId: "t0203",
                value: 2
            }
        ]);
    });
});
