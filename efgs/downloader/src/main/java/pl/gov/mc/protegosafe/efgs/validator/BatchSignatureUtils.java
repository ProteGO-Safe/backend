package pl.gov.mc.protegosafe.efgs.validator;

import com.google.protobuf.ByteString;
import com.google.protobuf.ProtocolStringList;
import eu.interop.federationgateway.model.EfgsProto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
class BatchSignatureUtils {

    byte[] generateBytesToVerify(EfgsProto.DiagnosisKeyBatch batch) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        sortBatchByKeyData(batch)
                .forEach(diagnosisKey -> byteArrayOutputStream.writeBytes(generateBytesToVerify(diagnosisKey)));

        return byteArrayOutputStream.toByteArray();
    }

    private List<EfgsProto.DiagnosisKey> sortBatchByKeyData(EfgsProto.DiagnosisKeyBatch batch) {
        return batch.getKeysList()
                .stream()
                .sorted(Comparator.comparing(diagnosisKey -> bytesToBase64(generateBytesToVerify(diagnosisKey))))
                .collect(Collectors.toList());
    }

    private byte[] generateBytesToVerify(final EfgsProto.DiagnosisKey diagnosisKey) {
        final ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        writeBytesInByteArray(diagnosisKey.getKeyData(), byteArrayOutputStream);
        writeSeperatorInArray(byteArrayOutputStream);
        writeIntInByteArray(diagnosisKey.getRollingStartIntervalNumber(), byteArrayOutputStream);
        writeSeperatorInArray(byteArrayOutputStream);
        writeIntInByteArray(diagnosisKey.getRollingPeriod(), byteArrayOutputStream);
        writeSeperatorInArray(byteArrayOutputStream);
        writeIntInByteArray(diagnosisKey.getTransmissionRiskLevel(), byteArrayOutputStream);
        writeSeperatorInArray(byteArrayOutputStream);
        writeVisitedCountriesInByteArray(diagnosisKey.getVisitedCountriesList(),
                byteArrayOutputStream);
        writeSeperatorInArray(byteArrayOutputStream);
        writeB64StringInByteArray(diagnosisKey.getOrigin(), byteArrayOutputStream);
        writeSeperatorInArray(byteArrayOutputStream);
        writeIntInByteArray(diagnosisKey.getReportTypeValue(), byteArrayOutputStream);
        writeSeperatorInArray(byteArrayOutputStream);
        writeIntInByteArray(diagnosisKey.getDaysSinceOnsetOfSymptoms(), byteArrayOutputStream);
        writeSeperatorInArray(byteArrayOutputStream);
        return byteArrayOutputStream.toByteArray();
    }

    private void writeSeperatorInArray(final ByteArrayOutputStream byteArray) {
        byteArray.writeBytes(".".getBytes(StandardCharsets.US_ASCII));
    }

    private void writeStringInByteArray(final String batchString, final ByteArrayOutputStream byteArray) {
        byteArray.writeBytes(batchString.getBytes(StandardCharsets.US_ASCII));
    }

    private void writeB64StringInByteArray(final String batchString, final ByteArrayOutputStream byteArray) {
        writeStringInByteArray(bytesToBase64(batchString.getBytes(StandardCharsets.US_ASCII)), byteArray);
    }

    private void writeIntInByteArray(final int batchInt, final ByteArrayOutputStream byteArray) {
        writeStringInByteArray(bytesToBase64(ByteBuffer.allocate(4).putInt(batchInt).array()), byteArray);
    }

    private void writeBytesInByteArray(final ByteString bytes, ByteArrayOutputStream byteArray) {
        writeStringInByteArray(bytesToBase64(bytes.toByteArray()), byteArray);
    }

    private void writeVisitedCountriesInByteArray(final ProtocolStringList countries,
                                                         final ByteArrayOutputStream byteArray) {
        writeB64StringInByteArray(String.join(",", countries), byteArray);
    }

    private String bytesToBase64(byte[] bytes) {
        return Base64.getEncoder().encodeToString(bytes);
    }

    public byte[] b64ToBytes(final String batchSignatureBase64) {
        return b64ToBytes(batchSignatureBase64.getBytes());
    }

    private byte[] b64ToBytes(final byte[] bytes) {
        return Base64.getDecoder().decode(bytes);
    }
}
