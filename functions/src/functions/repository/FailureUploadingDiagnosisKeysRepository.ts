import * as admin from "firebase-admin";
import config from "../../config"
import moment = require("moment");
import FailureUploadingDiagnosisKeys from "./FailureUploadingDiagnosisKeys";

class FailureUploadingDiagnosisKeysRepository {

    private getCollection(): FirebaseFirestore.CollectionReference {
        return admin.firestore().collection('failedUploadingToGensDiagnosisKeys');
    }

    save(failureUploadingDiagnosisKeys: FailureUploadingDiagnosisKeys): void {

        const id = failureUploadingDiagnosisKeys.id;
        this.getCollection()
            .doc(id)
            .set(this.createObjectToStore(failureUploadingDiagnosisKeys))
            .catch(reason => {
                throw new Error(reason)
            });
    }

    delete(id: string): void {

        this.getCollection()
            .doc(id)
            .delete()
            .catch(reason => {
                throw new Error(reason)
            });
    }

    async listLimitedOrderByDate(limit: number): Promise<Array<FailureUploadingDiagnosisKeys>> {
        const currentTimestamp = moment().unix();
        const snapshot = await this.getCollection()
            .where('createdAt', '>', currentTimestamp - config.efgs.failedGens.retryExpirationDays * 24 * 60 * 60)
            .orderBy('createdAt', 'asc')
            .limit(limit)
            .get()
        return snapshot.docs.map((item) => item.data() as FailureUploadingDiagnosisKeys);
    }

    private createObjectToStore(failureUploadingDiagnosisKeys: FailureUploadingDiagnosisKeys): any {
        return {
            id: failureUploadingDiagnosisKeys.id,
            createdAt: failureUploadingDiagnosisKeys.createdAt,
            dataAsBase64: failureUploadingDiagnosisKeys.dataAsBase64,
            errorMessage: failureUploadingDiagnosisKeys.errorMessage,
            stackTrace: failureUploadingDiagnosisKeys.stackTrace,
            tries: failureUploadingDiagnosisKeys.tries,
        }
    }
}

export default FailureUploadingDiagnosisKeysRepository;
