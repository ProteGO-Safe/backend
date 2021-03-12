import NewVaccinationsData from "./NewVaccinationsData";

interface NewData extends NewVaccinationsData {
    newCases: number,
    newDeaths: number,
    newRecovered: number,
}

export default NewData;