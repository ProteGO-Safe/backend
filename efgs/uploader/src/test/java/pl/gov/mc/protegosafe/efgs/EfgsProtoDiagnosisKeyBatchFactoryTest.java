package pl.gov.mc.protegosafe.efgs;

import eu.interop.federationgateway.model.EfgsProto;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.utils.BatchSignatureUtils;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class EfgsProtoDiagnosisKeyBatchFactoryTest {

    private EfgsProtoDiagnosisKeyBatchFactory efgsProtoDiagnosisKeyBatchFactory;

    @BeforeEach
    public void beforeEach() {
        efgsProtoDiagnosisKeyBatchFactory = new EfgsProtoDiagnosisKeyBatchFactory(new BatchSignatureUtils());
    }

    @Test
    public void shouldCreateKeyBatch() {
        // given
        final List<DiagnosisKey> keysWithoutDuplication = keys(false);

        // when
        final EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch = efgsProtoDiagnosisKeyBatchFactory
                .create(keysWithoutDuplication);

        // then
        Assertions.assertThat(diagnosisKeyBatch.getKeysList()).hasSize(10);
    }

    @Test
    public void shouldCreateKeyBatchWithIgnoredDuplicates() {
        // given
        final List<DiagnosisKey> keysWithDuplication = keys(true);

        // when
        final EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch = efgsProtoDiagnosisKeyBatchFactory
                .create(keysWithDuplication);

        // then
        Assertions.assertThat(diagnosisKeyBatch.getKeysList()).hasSize(10);
    }

    private List<DiagnosisKey> keys(boolean withDuplicate) {
        final List<DiagnosisKey> list = IntStream
                .range(0, 10)
                .mapToObj(e -> DiagnosisKey.random())
                .collect(Collectors.toList());

        if (withDuplicate) {
            list.add(list.get(0));
            list.add(list.get(1));
        }

        return list;
    }
}
