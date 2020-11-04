package pl.gov.mc.protegosafe.efgs.uploader;

import com.google.api.client.util.Lists;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import pl.gov.mc.protegosafe.efgs.uploader.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.uploader.model.ReportType;

import java.util.ArrayList;
import java.util.List;

public class EfgsFakeDiagnosisKeysFactoryTest {

    private EfgsFakeDiagnosisKeysFactory factory;

    @BeforeEach
    public void beforeEach() {
        factory = new EfgsFakeDiagnosisKeysFactory();
    }

    @Test
    public void shouldFillEmptyDiagnosisKeysList() {
        // given
        int filledTo = 5;
        List<DiagnosisKey> keysList = new ArrayList<DiagnosisKey>();

        // when
        List<DiagnosisKey> filledCollection = factory.fillFakesDiagnosisKeys(keysList, filledTo);

        // then
        Assertions.assertThat(filledCollection).hasSize(filledTo);
    }


    @Test
    public void shouldFillToDiagnosisKeysList() {
        // given
        int filledTo = 5;
        List<DiagnosisKey> keysList = new ArrayList<DiagnosisKey>();
        keysList.add(new DiagnosisKey(
                "key",
                1,
                1,
                1,
                Lists.newArrayList(),
                "origin",
                ReportType.CONFIRMED_TEST,
                1
        ));

        keysList.add(new DiagnosisKey(
                "key2",
                1,
                1,
                1,
                Lists.newArrayList(),
                "origin",
                ReportType.CONFIRMED_TEST,
                1
        ));

        // when
        List<DiagnosisKey> filledCollection = factory.fillFakesDiagnosisKeys(keysList, filledTo);

        // then
        Assertions.assertThat(filledCollection).hasSize(filledTo);
    }
}
