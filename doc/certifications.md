* Generate private key
```bash
openssl genpkey -outform PEM -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out nbtls-pl-priv.key
```
* Generate certificate signing request
```bash
openssl req -new -nodes -key nbtls-pl-priv.key -config certconfig.txt -out nbtls-pl-cert.csr
```
certconfig.txt
```
[ req ]
default_md = sha256
prompt = no
req_extensions = req_ext
distinguished_name = req_distinguished_name
[ req_distinguished_name ]
commonName = ProteGO Safe
countryName = PL
stateOrProvinceName = Mazowieckie
localityName = Warszawa
organizationName = KPRM
emailAddress = protego@mc.gov.pl
organizationalUnitName = ProteGO Safe
[ req_ext ]
keyUsage=digitalSignature
extendedKeyUsage=clientAuth
```
* Generate certificate
```bash
openssl req -x509 -nodes -in nbtls-pl-cert.csr -days 365 -key nbtls-pl-priv.key -config certconfig.txt -extensions req_ext -out nbtls-pl-cert.crt
```
* repeat previously steps with nbbs instead of nbtls in each command
* next command are necessary for efgs server
* execute [create_ta.sh](../utils/create_ta.sh), it creates cert.pem, efgs-ta.jks, key.pem
* create der file from cert file
```bash
openssl pkcs8 -topk8 -inform PEM -outform DER -in key.pem -out efgs-ta-key.der -nocrypt
```
* create signature for nbtls-pl-cert.crt and nbbs-pl-cert.crt with [SignatureGenerator.java](../utils/src/main/java/pl/gov/mc/protegosafe/SignatureGenerator.java) by add args absolute_path_to_efgs-ta-key.der absolute_path_to_nbtls-pl-cert.crt
* generate fingerprint for nbtls-pl-cert.crt and nbbs-pl-cert.crt
```bash
openssl x509 -in nbtls-pl-cert.crt -noout -hash -sha256 -fingerprint
```
* execute insert (make fingerprint lowercase without :)
```sql
INSERT INTO fg.`certificate`(`created_at`, `thumbprint`, `country`, `type`, `revoked`, `host`, `signature`, `raw_data`) VALUES (curdate(),'fingerprint_from_nbtls-pl-cert.crt','PL','AUTHENTICATION',false,null, 'signature_from_nbtls-pl-cert.crt', '-----BEGIN CERTIFICATE-----RAW DATA from nbtls-pl-cert.crt-----END CERTIFICATE-----');
INSERT INTO fg.`certificate`(`created_at`, `thumbprint`, `country`, `type`, `revoked`, `host`, `signature`, `raw_data`) VALUES (curdate(),'fingerprint_from_nbbs-pl-cert.crt','PL','SIGNING',false,null, 'signature_from_nbbs-pl-cert.crt', '-----BEGIN CERTIFICATE-----RAW DATA from nbbs-pl-cert.crt-----END CERTIFICATE-----');
```
