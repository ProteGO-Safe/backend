package pl.gov.mc.protegosafe.efgs;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.google.cloud.logging.LogEntry;
import com.google.cloud.logging.logback.LoggingEventEnhancer;

public class CloudEnhancer implements LoggingEventEnhancer {

    public void enhanceLogEntry(LogEntry.Builder builder, ILoggingEvent e) {
        e.getMDCPropertyMap().forEach((key, value) -> {
            if (null != key && null != value) {
                builder.addLabel(key, value);
            }
        });

        if (e.getLevel().equals(Level.ERROR)) {
            builder.addLabel("error-stopcovid", e.getMessage());
        }
    }
}
