import * as ff from 'firebase-functions';
import config, {applicationIPChecker, secretManager} from "./config";

export function https(
    handler : (data: any, context: ff.https.CallableContext) => any | Promise<any>,
    runtime: ff.RuntimeOptions = {memory: '256MB', timeoutSeconds: 30}
): ff.HttpsFunction {
    return ff.runWith(runtime).region(...config.regions).https.onCall(async (data, context) => {
        const securityToken = await secretManager.getConfig('securityToken');
        const securityHeaderName = await secretManager.getConfig('securityTokenHeaderName');

        if (!await applicationIPChecker.allow(<string>context.rawRequest.header('X-Appengine-User-Ip'))) {
            throw new ff.https.HttpsError('permission-denied', 'Permission denied.');
        }

        if (context.rawRequest.header(securityHeaderName) !== securityToken) {
            throw new ff.https.HttpsError('permission-denied', 'Permission denied.');
        }

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
