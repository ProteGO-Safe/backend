import * as ff from 'firebase-functions';
import config from "./config";

export function https(
    handler : (data: any, context: ff.https.CallableContext) => any | Promise<any>,
    runtime: ff.RuntimeOptions = {memory: '256MB', timeoutSeconds: 30}
): ff.HttpsFunction {
    return ff.runWith(runtime).region(...config.regions).https.onCall(async (data, context) => {
        return handler(data, context);
    });
}

export function scheduler(
    handler : (data: any) => any | Promise<any>,
    schedule: string,
    runtime: ff.RuntimeOptions = {memory: '256MB', timeoutSeconds: 30}
) {
    return ff.runWith(runtime).region(...config.regions).pubsub.schedule(schedule).onRun(handler)
}
