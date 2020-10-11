package pl.gov.mc.protegosafe.efgs.repository;

import java.time.LocalDate;

public interface BatchTagRepository {

    void saveLastBatchTag(LocalDate date, String lastBatchTag);
    String fetchLastProcessedBatchTag(LocalDate date);
}
