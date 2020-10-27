package pl.gov.mc.protegosafe.efgs.repository;

import pl.gov.mc.protegosafe.efgs.repository.model.LastProcessedBatchTag;

import java.time.LocalDate;

public interface BatchTagRepository {

    void saveLastBatchTag(LocalDate date, String lastBatchTag, int sentKeys);
    LastProcessedBatchTag fetchLastProcessedBatchTag(LocalDate date);
}
