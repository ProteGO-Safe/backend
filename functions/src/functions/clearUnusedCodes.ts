import config from "../config";

export async function clearUnusedCodes() {
    await config.code.repository.removeExpired();
}
