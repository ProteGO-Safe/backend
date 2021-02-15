import OpenCensusContainer from "./OpenCensusContainer";
import {TagMap} from "@opencensus/core";

export default (
    numberOfKeys: number,
    isInteroperabilityEnabled: boolean,
    {globalStats, tagKey, measure}: OpenCensusContainer
) => {
    const tags = new TagMap();
    tags.set(tagKey, {value: isInteroperabilityEnabled ? "true" : "false"});

    globalStats.record([{
        measure,
        value: numberOfKeys
    }], tags);
}
