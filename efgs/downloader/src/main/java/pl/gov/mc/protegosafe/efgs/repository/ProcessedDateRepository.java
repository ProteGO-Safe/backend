package pl.gov.mc.protegosafe.efgs.repository;

import java.time.LocalDate;
import java.util.List;

public interface ProcessedDateRepository {

    List<ProcessedDate> listLastProcessedDate(int limit);
    void markDateAsProcessed(LocalDate date);
}
