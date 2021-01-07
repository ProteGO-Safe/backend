package pl.gov.mc.protegosafe.efgs;

import com.google.cloud.logging.LogEntry;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.MDC;
import org.springframework.cloud.gcp.core.DefaultGcpProjectIdProvider;
import org.springframework.cloud.gcp.core.GcpProjectIdProvider;
import org.springframework.cloud.gcp.logging.TraceIdLoggingEnhancer;

public class CloudEnhancer extends TraceIdLoggingEnhancer {

    private final GcpProjectIdProvider projectIdProvider = new DefaultGcpProjectIdProvider();

    public void enhanceLogEntry(LogEntry.Builder builder) {
        super.enhanceLogEntry(builder);
        String severity = MDC.get("severity");

        builder.addLabel("project", projectIdProvider.getProjectId());

        if (StringUtils.equalsIgnoreCase(severity, "error")) {
            builder.addLabel("error-stopcovid", projectIdProvider.getProjectId());
        }
    }
}
