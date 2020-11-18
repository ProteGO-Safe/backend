package pl.gov.mc.protegosafe.efgs.utils;

import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.cert.X509CertificateHolder;
import org.bouncycastle.cert.jcajce.JcaX509CertificateConverter;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;

import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@Slf4j
public class CertUtils {

    @SneakyThrows
    public static X509Certificate loadCertificateFromFile(String cert) {
        PEMParser parser = createPEMParser(cert);
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
    public static PrivateKey loadPrivateKeyFromFile(String privateKeyfileName) {
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
    private static PEMParser createPEMParser(String cert) {
        return new PEMParser(new InputStreamReader(IOUtils.toInputStream(cert, Charset.defaultCharset())));
    }
}
