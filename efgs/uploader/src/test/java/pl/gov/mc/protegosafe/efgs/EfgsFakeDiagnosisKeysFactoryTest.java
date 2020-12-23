package pl.gov.mc.protegosafe.efgs;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pl.gov.mc.protegosafe.efgs.repository.model.DiagnosisKey;

import java.util.ArrayList;
import java.util.List;

import static com.google.common.collect.Lists.newArrayList;

class EfgsFakeDiagnosisKeysFactoryTest {

    private EfgsFakeDiagnosisKeysFactory efgsFakeDiagnosisKeysFactory;

    @BeforeEach
    void beforeEach() {
        efgsFakeDiagnosisKeysFactory = new EfgsFakeDiagnosisKeysFactory();
    }


    @Test
    void shouldFillEmptyDiagnosisKeysList() {

        // given
        int filledTo = 5;
        List<DiagnosisKey> keysList = new ArrayList<>();

        // when
        List<DiagnosisKey> filledCollection = efgsFakeDiagnosisKeysFactory.fillFakesDiagnosisKeys(keysList, filledTo);

        // then
        Assertions.assertThat(filledCollection).hasSize(filledTo);
    }


    @Test
    void shouldFillToDiagnosisKeysList() {

        // given
        int filledTo = 5;
        List<DiagnosisKey> keysList = newArrayList(DiagnosisKey.random(), DiagnosisKey.random());

        // when
        List<DiagnosisKey> filledCollection = efgsFakeDiagnosisKeysFactory.fillFakesDiagnosisKeys(keysList, filledTo);

        // then
        Assertions.assertThat(filledCollection).hasSize(filledTo);
    }
}
