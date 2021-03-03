class FileNotFoundError extends Error {
    constructor(m: string) {
        super(m);

        Object.setPrototypeOf(this, FileNotFoundError.prototype);
    }
}

export default FileNotFoundError