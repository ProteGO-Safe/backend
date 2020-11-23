package pl.gov.mc.protegosafe.efgs;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.repository.ProcessedDateRepository;
import pl.gov.mc.protegosafe.efgs.repository.ProcessedDate;

import java.time.LocalDate;
import java.util.List;
import java.util.function.Predicate;

@Slf4j
@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class ProcessedDateService {

    ProcessedDateRepository processedDateRepository;
    DateProvider dateProvider;
    int daysToCheckBeforeNow;

    @Autowired
    ProcessedDateService(ProcessedDateRepository processedDateRepository, DateProvider dateProvider, Properties properties) {
        this.processedDateRepository = processedDateRepository;
        this.dateProvider = dateProvider;
        this.daysToCheckBeforeNow = properties.getDownloader().getDaysToCheckBeforeNow();
    }

    LocalDate fetchDateToProcess() {

        LocalDate now = dateProvider.now();

        log.info("started fetching date");

        List<ProcessedDate> processedDates = processedDateRepository.listLastProcessedDate(daysToCheckBeforeNow);

        return processedDates
                .stream()
                .filter(processedDate -> isNotTooOld(processedDate, now))
                .filter(Predicate.not(ProcessedDate::isFullyProcessed))
                .findFirst()
                .map(ProcessedDate::getDate)
                .orElseGet(() -> processAlternativeDate(now, processedDates));

    }

    private LocalDate processAlternativeDate(LocalDate now, List<ProcessedDate> processedDates) {
        return processedDates.stream()
                .findFirst()
                .map(ProcessedDate::getDate)
                .map(localDate -> localDate.plusDays(1))
                .orElseGet(() -> now.minusDays(daysToCheckBeforeNow));
    }

    private boolean isNotTooOld(ProcessedDate processedDate, LocalDate now) {
        return processedDate.getDate().isAfter(now.minusDays(daysToCheckBeforeNow));
    }

    void markDateAsProcessed(LocalDate date) {

        if (date.equals(LocalDate.now())) {
            return;
        }

        processedDateRepository.markDateAsProcessed(date);
    }
}
