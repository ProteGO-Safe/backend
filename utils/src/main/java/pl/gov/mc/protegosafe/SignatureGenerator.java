package pl.gov.mc.protegosafe;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;

public class SignatureGenerator {

    /**
     * Generates signature
     *
     * @param args with array of absolute path to efgs-ta-key.der and absolute path to cert.crt
     */
    public static void main(String[] args) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException, InvalidKeyException, SignatureException {

        if (args.length != 2) {
            throw new IllegalArgumentException("please run with 2 arguments");
        }

        byte[] privateKeyBytes = readBytes(args[0]);
        byte[] certificateBytes = readBytes(args[1]);

        Signature signer = Signature.getInstance("SHA256withRSA");
        signer.initSign(getPrivateKey(privateKeyBytes));
        signer.update(certificateBytes);
        byte[] signedData = signer.sign();
        String signature = Base64.getEncoder().encodeToString(signedData);
        System.out.println(signature);
    }

    private static byte[] readBytes(String filename) throws IOException {
        return Files.readAllBytes(Paths.get(filename));
    }

    private static PrivateKey getPrivateKey(byte[] bytes) throws NoSuchAlgorithmException, InvalidKeySpecException {

        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(bytes);
        KeyFactory kf = KeyFactory.getInstance("RSA");
        return kf.generatePrivate(spec);
    }
}
