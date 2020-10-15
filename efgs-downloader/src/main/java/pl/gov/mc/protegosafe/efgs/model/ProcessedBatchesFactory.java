package pl.gov.mc.protegosafe.efgs.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ProcessedBatchesFactory {

    ObjectMapper objectMapper;

    @SneakyThrows
    public ProcessedBatches create(String batchTag, String diagnosisKeyBatchAsString) {
        KeysWrapper keysWrapper = objectMapper.readValue(diagnosisKeyBatchAsString, KeysWrapper.class);
        return new ProcessedBatches(batchTag, keysWrapper.getKeys());
    }
}
