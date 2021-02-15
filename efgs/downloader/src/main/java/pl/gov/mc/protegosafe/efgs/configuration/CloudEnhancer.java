package pl.gov.mc.protegosafe.efgs.configuration;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import com.google.cloud.MonitoredResource;
import com.google.cloud.logging.LogEntry;
import com.google.cloud.logging.logback.LoggingEventEnhancer;

import java.util.UUID;

public class CloudEnhancer implements LoggingEventEnhancer {

    private static final String executionId = UUID.randomUUID().toString();

    public void enhanceLogEntry(LogEntry.Builder builder, ILoggingEvent e) {
        e.getMDCPropertyMap().forEach((key, value) -> {
            if (null != key && null != value) {
                builder.addLabel(key, value);
            }
        });

        if (e.getLevel().equals(Level.ERROR)) {
            builder.addLabel("error-stopcovid", e.getMessage());
        }

        builder.addLabel("execution_id", executionId.substring(24));

        final MonitoredResource resource = MonitoredResource
                .newBuilder("cloud_function")
                .addLabel("function_name", System.getenv("STACKDRIVER_LOG_NAME"))
                .build();

        builder.setResource(resource);
    }
}
