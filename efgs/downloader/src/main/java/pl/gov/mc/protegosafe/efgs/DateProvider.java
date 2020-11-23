package pl.gov.mc.protegosafe.efgs;

import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
class DateProvider {

    LocalDate now() {
        return LocalDate.now();
    }
}
