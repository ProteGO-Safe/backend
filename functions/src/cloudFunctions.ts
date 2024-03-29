import * as ff from 'firebase-functions';
import {applicationIPChecker, secretManager} from "./services";

const {region, cdnbucket, timezone} = ff.config().config;

export function https(
    handler : (data: any, context: ff.https.CallableContext) => any | Promise<any>,
    runtime: ff.RuntimeOptions = {memory: '256MB', timeoutSeconds: 180}
): ff.HttpsFunction {

    return ff.runWith(runtime).region(region).https.onCall(async (data, context) => {
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

export function httpsOnRequest(
    handler : (data: any, response: ff.Response) => any | Promise<any>,
    runtime: ff.RuntimeOptions = {memory: '256MB', timeoutSeconds: 30}
): ff.HttpsFunction {
    return ff.runWith(runtime).region(region).https.onRequest(async (request, response) => {
        const securityToken = await secretManager.getConfig('securityToken');
        const securityHeaderName = await secretManager.getConfig('securityTokenHeaderName');

        if (!await applicationIPChecker.allow(<string>request.header('X-Appengine-User-Ip'))) {
            return response.status(403).send({error: {message: "", status: "PERMISSION_DENIED"}});
        }

        if (request.header(securityHeaderName) !== securityToken) {
            return response.status(403).send({error: {message: "", status: "PERMISSION_DENIED"}});
        }

        return handler(request, response);
    });
}

export function scheduler(
    handler : (data: any) => any | Promise<any>,
    schedule: string,
    runtime: ff.RuntimeOptions = {memory: '256MB', timeoutSeconds: 30}
) {
    return ff.runWith(runtime)
        .region(region)
        .pubsub.schedule(schedule)
        .timeZone(timezone)
        .onRun(handler)
}

export const topicSubscriber = (handler : (data: any) => any | Promise<any>) => {
    return ff.runWith({memory: '256MB', timeoutSeconds: 30})
        .region(region)
        .pubsub.topic(`firebase-subscription-${handler.name}-${region}`)
        .onPublish(handler);
};

export function storage(
    handler: (object: ff.storage.ObjectMetadata) => any | Promise<any>,
    runtimeOpt: ff.RuntimeOptions = {memory: '256MB', timeoutSeconds: 60}
): ff.CloudFunction<ff.storage.ObjectMetadata> {
    return ff
        .runWith(runtimeOpt)
        .region(region)
        .storage
        .bucket(cdnbucket)
        .object().onFinalize(async (object : ff.storage.ObjectMetadata) => {
            return handler(object);
        });
}
