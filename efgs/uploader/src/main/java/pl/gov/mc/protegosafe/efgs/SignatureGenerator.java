package pl.gov.mc.protegosafe.efgs;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cms.CMSProcessableByteArray;
import org.bouncycastle.cms.CMSSignedData;
import org.bouncycastle.cms.CMSSignedDataGenerator;
import org.bouncycastle.cms.SignerInfoGenerator;
import org.bouncycastle.cms.jcajce.JcaSignerInfoGeneratorBuilder;
import org.bouncycastle.operator.ContentSigner;
import org.bouncycastle.operator.DigestCalculatorProvider;
import org.bouncycastle.operator.jcajce.JcaContentSignerBuilder;
import org.bouncycastle.operator.jcajce.JcaDigestCalculatorProviderBuilder;
import pl.gov.mc.protegosafe.efgs.utils.CertUtils;

import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.Base64;

@Slf4j
class SignatureGenerator {

    private final SignerInfoGenerator signerInfo;
    private final X509CertificateHolder certificateHolder;

    @SneakyThrows
    SignatureGenerator(String cert) {
        X509Certificate certificate = CertUtils.loadCertificateFromFile(cert);
        PrivateKey privateKey = CertUtils.loadPrivateKeyFromFile(cert);

        DigestCalculatorProvider digestCalculatorProvider = new JcaDigestCalculatorProviderBuilder().build();
        ContentSigner contentSigner =
                new JcaContentSignerBuilder(certificate.getSigAlgName()).build(privateKey);
        signerInfo = new JcaSignerInfoGeneratorBuilder(digestCalculatorProvider).build(contentSigner, certificate);
        certificateHolder = new X509CertificateHolder(certificate.getEncoded());
    }

    @SneakyThrows
    String getSignatureForBytes(byte[] data) {
        final CMSSignedDataGenerator signedDataGenerator = new CMSSignedDataGenerator();

        signedDataGenerator.addSignerInfoGenerator(signerInfo);
        signedDataGenerator.addCertificate(certificateHolder);

        CMSSignedData signedData = signedDataGenerator.generate(new CMSProcessableByteArray(data), false);
        return Base64.getEncoder().encodeToString(signedData.getEncoded());
    }
}
