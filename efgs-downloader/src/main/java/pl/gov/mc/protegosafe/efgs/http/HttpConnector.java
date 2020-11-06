package pl.gov.mc.protegosafe.efgs.http;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface HttpConnector {

    Optional<BatchesResponse> fetchBatches(LocalDate date, final String batchTag);
    List<AuditResponse> listAudits(String batchTag, LocalDate date);
}
