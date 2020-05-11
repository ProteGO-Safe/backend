import config from "../config";

export async function clearUnusedCodes(data: any) {
    await config.code.repository.removeExpired();
}
