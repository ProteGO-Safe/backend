package pl.gov.mc.protegosafe.efgs.repository;

import java.time.LocalDate;

public interface BatchTagRepository {

    void saveBatchTag(LocalDate date, String batchTag, int sentKeys);
    FirestoreBatchTag fetchLastProcessedBatchTag(LocalDate date);
}
