package pl.gov.mc.protegosafe.efgs.downloader;

import eu.interop.federationgateway.model.EfgsProto.DiagnosisKeyBatch;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cms.*;
import org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoVerifierBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.Store;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.security.Security;
import java.util.Collection;
import java.util.Date;


@Slf4j
class BatchSignatureVerifier {

    @SneakyThrows
    static boolean verify(final DiagnosisKeyBatch batch, final String base64BatchSignature) {
        Security.addProvider(new BouncyCastleProvider());
        final byte[] batchSignatureBytes = BatchSignatureUtils.b64ToBytes(base64BatchSignature);
        if (batchSignatureBytes == null) {
            return false;
        }
        final CMSSignedData signedData = new CMSSignedData(getBatchBytes(batch), batchSignatureBytes);
        final SignerInformation signerInfo = getSignerInformation(signedData);

        if (signerInfo == null) {
            log.error("no signer information");
            return false;
        }

        final X509CertificateHolder signerCert = getSignerCert(signedData.getCertificates(), signerInfo.getSID());

        if (signerCert == null) {
            log.error("no signer certificate");
            return false;
        }

        if (!isCertNotExpired(signerCert)) {
            log.error("signing certificate expired\", certNotBefore=\"{}\", certNotAfter=\"{}",
                    signerCert.getNotBefore(), signerCert.getNotAfter());
            return false;
        }

        if (!allOriginsMatchingCertCountry(batch, signerCert)) {
            log.error("different origins\", certNotBefore=\"{}\", certNotAfter=\"{}",
                    signerCert.getNotBefore(), signerCert.getNotAfter());
            return false;
        }

        return verifySignerInfo(signerInfo, signerCert);

    }

    private static boolean allOriginsMatchingCertCountry(DiagnosisKeyBatch batch, X509CertificateHolder certificate) {
        String country = getCountryOfCertificate(certificate);

        if (country == null) {
            return false;
        } else {
            return batch.getKeysList().stream()
                    .allMatch(key -> key.getOrigin().equals(country));
        }
    }

    private static boolean isCertNotExpired(X509CertificateHolder certificate) {
        Date now = new Date();

        return certificate.getNotBefore().before(now)
                && certificate.getNotAfter().after(now);
    }

    private static String getCountryOfCertificate(X509CertificateHolder certificate) {
        RDN[] rdns = certificate.getSubject().getRDNs(BCStyle.C);
        if (rdns.length != 1) {
            log.info("Certificate has no valid country attribute");
            return null;
        } else {
            return rdns[0].getFirst().getValue().toString();
        }
    }

    private static CMSProcessableByteArray getBatchBytes(DiagnosisKeyBatch batch) {
        return new CMSProcessableByteArray(BatchSignatureUtils.generateBytesToVerify(batch));
    }

    private static SignerInformation getSignerInformation(final CMSSignedData signedData) {
        final SignerInformationStore signerInfoStore = signedData.getSignerInfos();

        if (signerInfoStore.size() > 0) {
            return signerInfoStore.getSigners().iterator().next();
        }
        return null;
    }

    private static X509CertificateHolder getSignerCert(final Store<X509CertificateHolder> certificatesStore,
                                                       final SignerId signerId) {
        final Collection certCollection = certificatesStore.getMatches(signerId);

        if (!certCollection.isEmpty()) {
            return (X509CertificateHolder) certCollection.iterator().next();
        }
        return null;
    }

    @SneakyThrows
    private static boolean verifySignerInfo(final SignerInformation signerInfo, final X509CertificateHolder signerCert) {
        return signerInfo.verify(createSignerInfoVerifier(signerCert));
    }

    @SneakyThrows
    private static SignerInformationVerifier createSignerInfoVerifier(final X509CertificateHolder signerCert) {
        return new JcaSimpleSignerInfoVerifierBuilder().setProvider(BouncyCastleProvider.PROVIDER_NAME).build(signerCert);
    }

}
