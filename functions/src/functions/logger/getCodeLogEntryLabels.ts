import {CodeStatus} from "../code/CodeStatus";
import {CodeType} from "../code/CodeType";
import {CodeEvent} from "../code/CodeEvent";

export default (
    hash: string,
    codeEvent: CodeEvent,
    platform?: string,
    codeStatus?: CodeStatus,
    codeType?: CodeType,
    expiryTime?: number,
    deleteTime?: number,
) => ({
    labels: {
        hash,
    },
    data: {
        hash,
        codeStatus,
        codeType,
        codeEvent,
        timestamp: Math.floor(Date.now() / 1000),
        expiryTime,
        deleteTime,
        platform
    }
});
