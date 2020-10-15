package pl.gov.mc.protegosafe.efgs.http;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;

import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@Slf4j
class CertUtils {

    @SneakyThrows
    static X509Certificate loadCertificateFromFile(String certificateFileName) {
        PEMParser parser = createPEMParser(certificateFileName);
        while (parser.ready()) {
            Object pemContent = parser.readObject();

            if (pemContent instanceof X509CertificateHolder) {
                JcaX509CertificateConverter converter = new JcaX509CertificateConverter();
                return converter.getCertificate((X509CertificateHolder) pemContent);
            }
        }
        throw new IllegalArgumentException("can not read certificate");
    }

    @SneakyThrows
    static PrivateKey loadPrivateKeyFromFile(String privateKeyfileName) {
        PEMParser parser = createPEMParser(privateKeyfileName);
        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        while (parser.ready()) {
            Object pemContent = parser.readObject();

            if (pemContent instanceof PrivateKeyInfo) {
                return converter.getPrivateKey((PrivateKeyInfo) pemContent);
            } else if (pemContent instanceof PEMKeyPair) {
                return converter.getPrivateKey(((PEMKeyPair) pemContent).getPrivateKeyInfo());
            }
        }
        throw new IllegalArgumentException("can not read certificate");
    }

    @SneakyThrows
    private static PEMParser createPEMParser(String certificateFileName) {
        return new PEMParser(new InputStreamReader(readFileFromResource(certificateFileName)));
    }

    @SneakyThrows
    private static InputStream readFileFromResource(final String filePath) {
        return new FileInputStream(filePath);
    }
}
