package pl.gov.mc.protegosafe.efgs.configuration;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.google.cloud.logging.LogEntry;
import com.google.cloud.logging.logback.LoggingEventEnhancer;

public class CloudEnhancer implements LoggingEventEnhancer {

    public void enhanceLogEntry(LogEntry.Builder builder, ILoggingEvent e) {
        if (e.getLevel().equals(Level.ERROR)) {
            builder.addLabel("error-stopcovid", e.getMessage());
        }

        if (e.getLevel().equals(Level.INFO)) {
            builder.addLabel("info-stopcovid", e.getMessage());
        }
    }
}
