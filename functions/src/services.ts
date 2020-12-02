import RandomCodeGenerator from "./utils/RandomCodeGenerator";
import CodeRepository from "./utils/CodeRepository";
import SubscriptionRepository from "./utils/SubscriptionRepository";
import SecretManager from "./utils/SecretManager";
import IPChecker from "./utils/IPChecker";

export const secretManager = new SecretManager();
export const generateCodeIPChecker = new IPChecker('generateCodeNetmasks');
export const applicationIPChecker = new IPChecker('applicationNetmasks');
export const codeGenerator = new RandomCodeGenerator(6);
export const codeRepository = new CodeRepository();
export const subscriptionRepository = new SubscriptionRepository();
