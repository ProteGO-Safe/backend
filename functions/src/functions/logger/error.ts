import errorLogger from "./errorLogger";
import errorEntryLabels from "./errorEntryLabels";

const logError = (errorObj: any) => {
    errorLogger.error(errorEntryLabels(errorObj), errorObj);
};

export default logError;

