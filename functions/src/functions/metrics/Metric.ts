import Entity from "./../repository/Entity";

interface Metric extends Entity {
    data: any,
    createdAt: number,
    type: string
}

export default Metric;