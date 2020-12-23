package pl.gov.mc.protegosafe.efgs;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import pl.gov.mc.protegosafe.efgs.repository.model.ReportType;

public class ReportTypeTest {

    @Test
    public void shouldBeAbleToInitFromIntTest()
    {
        //when
        ReportType reportType = ReportType.fromInt(1);

        //then
        Assertions.assertEquals(1, reportType.getValue());
    }

    @Test
    public void shouldThrowsExceptionWhenValueNotFound()
    {
        Assertions.assertThrows(IllegalArgumentException.class, () -> ReportType.fromInt(ReportType.values().length + 1));
    }
}
