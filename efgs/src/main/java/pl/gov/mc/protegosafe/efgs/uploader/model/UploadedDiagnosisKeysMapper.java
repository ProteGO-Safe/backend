package pl.gov.mc.protegosafe.efgs.uploader.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.SneakyThrows;

public class UploadedDiagnosisKeysMapper {

    @SneakyThrows
    public static DiagnosisKeyBatch createUploadedDiagnosisKeys(String jsonSource) {

        ObjectMapper objectMapper = new ObjectMapper();

        return objectMapper.readValue(jsonSource, DiagnosisKeyBatch.class);
    }
}
