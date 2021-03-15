import NewVaccinationsData from "./NewVaccinationsData";

interface NewData extends NewVaccinationsData {
    newCases: number | null,
    newDeaths: number | null,
    newRecovered: number | null,
}

export default NewData;