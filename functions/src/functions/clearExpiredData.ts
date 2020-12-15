import config from "../config";

export async function clearExpiredData() {
    await config.code.repository.removeExpired();
    await config.code.hashedAccessTokensRepository.removeExpired();
}
