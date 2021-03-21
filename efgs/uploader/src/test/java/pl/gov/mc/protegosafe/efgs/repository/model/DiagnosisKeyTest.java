package pl.gov.mc.protegosafe.efgs.repository.model;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;

class DiagnosisKeyTest {

    @Test
    public void shouldCreateDiagnosisKeyWithMidnightRollingStartIntervalNumber() {

    	// given
        DiagnosisKey diagnosisKey = DiagnosisKey.random();

        // when
        Long rollingStartIntervalNumber = diagnosisKey.getRollingStartIntervalNumber();

        // then
        LocalDateTime localDateTime = LocalDateTime.ofEpochSecond(rollingStartIntervalNumber * 600, 0, ZoneOffset.UTC);
        Assertions.assertThat(localDateTime.getHour()).isEqualTo(0);
        Assertions.assertThat(localDateTime.getMinute()).isEqualTo(0);
        Assertions.assertThat(localDateTime.getSecond()).isEqualTo(0);
        Assertions.assertThat(localDateTime.getNano()).isEqualTo(0);
    }

    @Test
    public void shouldCreateDiagnosisKeyWithRollingStartIntervalNumberGreaterThanExpected() {

        // given
        long minimumRollingStart = Instant
                .now()
                .truncatedTo(ChronoUnit.DAYS)
                .minus(15, ChronoUnit.DAYS)
                .getEpochSecond() / 600;

        DiagnosisKey diagnosisKey = DiagnosisKey.random();

        // when
        Long rollingStartIntervalNumber = diagnosisKey.getRollingStartIntervalNumber();

        // then
        Assertions.assertThat(rollingStartIntervalNumber).isGreaterThan(minimumRollingStart);
    }

}