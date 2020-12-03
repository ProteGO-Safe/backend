import {hashedAccessTokensRepository, codeRepository} from "../services";

export async function clearExpiredData() {
    await codeRepository.removeExpired();
    await hashedAccessTokensRepository.removeExpired();
}
