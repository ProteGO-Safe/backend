package pl.gov.mc.protegosafe.efgs.model;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class ProcessedBatchesFactory {

    ObjectMapper objectMapper;

    @SneakyThrows
    public List<Key> create(String diagnosisKeyBatchAsString) {
        KeysWrapper keysWrapper = objectMapper.readValue(diagnosisKeyBatchAsString, KeysWrapper.class);
        return keysWrapper.getKeys();
    }
}
