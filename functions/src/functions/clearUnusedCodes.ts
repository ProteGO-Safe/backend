import { codeRepository } from "../services";

export async function clearUnusedCodes() {
    await codeRepository.removeExpired();
}
