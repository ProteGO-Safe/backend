import RandomCodeGenerator from "./utils/RandomCodeGenerator";
import CodeRepository from "./utils/CodeRepository";
import SubscriptionRepository from "./utils/SubscriptionRepository";
import SecretManager from "./utils/SecretManager";
import IPChecker from "./utils/IPChecker";
import HashedAccessTokensRepository from "./utils/HashedAccessTokensRepository";
import FailureUploadingDiagnosisKeysRepository from "./functions/repository/FailureUploadingDiagnosisKeysRepository";

export const secretManager = new SecretManager();
export const generateCodeIPChecker = new IPChecker('generateCodeNetmasks');
export const applicationIPChecker = new IPChecker('applicationNetmasks');
export const codeGenerator = new RandomCodeGenerator(6);
export const codeRepository = new CodeRepository();
export const subscriptionRepository = new SubscriptionRepository();
export const hashedAccessTokensRepository = new HashedAccessTokensRepository();
export const failureUploadingDiagnosisKeysRepository = new FailureUploadingDiagnosisKeysRepository();
