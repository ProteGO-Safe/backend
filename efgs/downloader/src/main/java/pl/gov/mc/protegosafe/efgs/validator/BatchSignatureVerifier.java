package pl.gov.mc.protegosafe.efgs.validator;

import eu.interop.federationgateway.model.EfgsProto;
import eu.interop.federationgateway.model.EfgsProto.DiagnosisKeyBatch;
import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.asn1.x500.RDN;
import org.bouncycastle.asn1.x500.style.BCStyle;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cms.*;
import org.bouncycastle.cms.jcajce.JcaSimpleSignerInfoVerifierBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.util.Store;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.http.AuditResponse;

import java.security.Security;
import java.util.Collection;
import java.util.Date;
import java.util.List;


@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class BatchSignatureVerifier {

    BatchSignatureUtils batchSignatureUtils;

    public BatchSignatureVerifier(BatchSignatureUtils batchSignatureUtils) {
        this.batchSignatureUtils = batchSignatureUtils;
        Security.addProvider(new BouncyCastleProvider());
    }

    public boolean validateDiagnosisKeyWithSignature(EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch,
                                                     List<AuditResponse> auditEntries) {
        for (AuditResponse auditResponse : auditEntries) {
            if (verify(diagnosisKeyBatch, auditResponse.getBatchSignature())) {
                return true;
            }
        }
        return false;
    }

    @SneakyThrows
    private boolean verify(final DiagnosisKeyBatch batch, final String base64BatchSignature) {
        final byte[] batchSignatureBytes = batchSignatureUtils.b64ToBytes(base64BatchSignature);
        if (batchSignatureBytes == null) {
            return false;
        }
        try {
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
        } catch (Exception e) {
            log.error("error verifying batch signature", e);
        }

        return false;

    }

    private boolean allOriginsMatchingCertCountry(DiagnosisKeyBatch batch, X509CertificateHolder certificate) {
        String country = getCountryOfCertificate(certificate);

        if (country == null) {
            return false;
        } else {
            return batch.getKeysList().stream()
                    .allMatch(key -> key.getOrigin().equals(country));
        }
    }

    private boolean isCertNotExpired(X509CertificateHolder certificate) {
        Date now = new Date();

        return certificate.getNotBefore().before(now)
                && certificate.getNotAfter().after(now);
    }

    private String getCountryOfCertificate(X509CertificateHolder certificate) {
        RDN[] rdns = certificate.getSubject().getRDNs(BCStyle.C);
        if (rdns.length != 1) {
            log.info("Certificate has no valid country attribute");
            return null;
        } else {
            return rdns[0].getFirst().getValue().toString();
        }
    }

    private CMSProcessableByteArray getBatchBytes(DiagnosisKeyBatch batch) {
        return new CMSProcessableByteArray(batchSignatureUtils.generateBytesToVerify(batch));
    }

    private SignerInformation getSignerInformation(final CMSSignedData signedData) {
        final SignerInformationStore signerInfoStore = signedData.getSignerInfos();

        if (signerInfoStore.size() > 0) {
            return signerInfoStore.getSigners().iterator().next();
        }
        return null;
    }

    private X509CertificateHolder getSignerCert(final Store<X509CertificateHolder> certificatesStore,
                                                final SignerId signerId) {
        final Collection certCollection = certificatesStore.getMatches(signerId);

        if (!certCollection.isEmpty()) {
            return (X509CertificateHolder) certCollection.iterator().next();
        }
        return null;
    }

    @SneakyThrows
    private boolean verifySignerInfo(final SignerInformation signerInfo, final X509CertificateHolder signerCert) {
        return signerInfo.verify(createSignerInfoVerifier(signerCert));
    }

    @SneakyThrows
    private SignerInformationVerifier createSignerInfoVerifier(final X509CertificateHolder signerCert) {
        return new JcaSimpleSignerInfoVerifierBuilder().setProvider(BouncyCastleProvider.PROVIDER_NAME).build(signerCert);
    }

}
