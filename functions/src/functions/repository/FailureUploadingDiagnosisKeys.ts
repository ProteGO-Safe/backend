class FailureUploadingDiagnosisKeys {


    constructor(private _id: string,
                private _createdAt: number,
                private _errorMessage: string,
                private _stackTrace: string,
                private _dataAsBase64: string,
                private _tries: number = 0) {
    }


    get id(): string {
        return this._id;
    }

    get createdAt(): number {
        return this._createdAt;
    }

    get tries(): number {
        return this._tries;
    }

    get errorMessage(): string {
        return this._errorMessage;
    }

    get stackTrace(): string {
        return this._stackTrace;
    }

    get dataAsBase64(): string {
        return this._dataAsBase64;
    }
}

export default FailureUploadingDiagnosisKeys;
