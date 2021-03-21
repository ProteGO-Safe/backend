import Entity from "../../repository/Entity";

interface Voivodeship extends Entity {
    externalId: string,
    uiId: number,
    name: string,
}

export default Voivodeship;