import * as bunyan from 'bunyan';
import {LoggingBunyan} from '@google-cloud/logging-bunyan';

const name = 'code-monitoring';

const loggingBunyan = new LoggingBunyan({
    logName: name,
});

export default bunyan.createLogger({
    name,
    streams: [
        {stream: process.stdout, level: 'info'},
        loggingBunyan.stream('info'),
    ],
});
