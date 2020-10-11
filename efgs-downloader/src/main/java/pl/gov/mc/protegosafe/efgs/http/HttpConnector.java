package pl.gov.mc.protegosafe.efgs.http;

import java.time.LocalDate;
import java.util.List;

public interface HttpConnector {

    BatchesResponse fetchBatches(LocalDate date, final String batchTag);
    String fetchNextBatchTag(LocalDate date, final String batchTag);
    List<AuditResponse> listAudits(String batchTag, LocalDate date);
}
