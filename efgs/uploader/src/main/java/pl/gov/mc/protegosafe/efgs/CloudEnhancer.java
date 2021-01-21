package pl.gov.mc.protegosafe.efgs;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.google.cloud.logging.LogEntry;
import com.google.cloud.logging.logback.LoggingEventEnhancer;
import org.apache.commons.lang3.StringUtils;

import static java.util.Objects.nonNull;

public class CloudEnhancer implements LoggingEventEnhancer {

    public void enhanceLogEntry(LogEntry.Builder builder, ILoggingEvent e) {
        e.getMDCPropertyMap().forEach((key, value) -> {
            if (null != key && null != value) {
                builder.addLabel(key, value);
            }
        });

        if (Level.ERROR.equals(e.getLevel())) {
            builder.addLabel("error-stopcovid", e.getMessage());
        }

        if (nonNull(e.getMarker()) && StringUtils.equals(e.getMarker().getName(), "CRITICAL")) {
            builder.addLabel("critical-stopcovid", e.getMessage());
        }
    }
}
