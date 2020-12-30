import {Measure, Stats} from "@opencensus/core/build/src/stats/types";
import {TagKey} from "@opencensus/core/build/src/tags/types";
import {StatsEventListener} from "@opencensus/core/build/src/exporters/types";

export default class OpenCensusContainer {
    constructor(readonly globalStats: Stats, readonly exporter: StatsEventListener, readonly tagKey: TagKey, readonly measure: Measure) {
    }
}
