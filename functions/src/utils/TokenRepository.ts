import moment = require("moment");

abstract class TokenRepository {
    async removeExpired(): Promise<void> {
        await this.getCollection()
            .where(this.deleteTimeFieldName(), '<', moment().unix())
            .limit(100)
            .get()
            .then(snapshot => snapshot.forEach(doc => doc.ref.delete()))

        await this.getCollection()
            .where(this.deleteTimeFieldName(), '==', null)
            .limit(100)
            .get()
            .then(snapshot => snapshot.forEach(doc => doc.ref.delete()))
    }

    abstract getCollection(): FirebaseFirestore.CollectionReference;
    abstract deleteTimeFieldName(): string;
}

export default TokenRepository;
