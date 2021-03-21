import Entity from "../../repository/Entity";

interface District extends Entity {
    externalId: string,
    voivodeshipId: string,
    uiId: number,
    name: string,
}

export default District;