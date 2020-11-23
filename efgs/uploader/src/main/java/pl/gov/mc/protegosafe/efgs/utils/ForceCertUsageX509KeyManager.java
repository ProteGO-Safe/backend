package pl.gov.mc.protegosafe.efgs.utils;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import javax.net.ssl.X509KeyManager;
import java.net.Socket;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

@RequiredArgsConstructor
public class ForceCertUsageX509KeyManager implements X509KeyManager {

    private final String[] dummyStringArray = new String[0];
    private final PrivateKey privateKey;
    private final X509Certificate x509Certificate;

    @Override
    public String[] getClientAliases(String keyType, Principal[] issuers) {
        return dummyStringArray;
    }

    @Override
    public String chooseClientAlias(String[] keyType, Principal[] issuers, Socket socket) {
        return StringUtils.EMPTY;
    }

    @Override
    public String[] getServerAliases(String keyType, Principal[] issuers) {
        return dummyStringArray;
    }

    @Override
    public String chooseServerAlias(String keyType, Principal[] issuers, Socket socket) {
        return StringUtils.EMPTY;
    }

    @Override
    public X509Certificate[] getCertificateChain(String alias) {
        return new X509Certificate[]{x509Certificate};
    }

    @Override
    public PrivateKey getPrivateKey(String alias) {
        return privateKey;
    }
}
