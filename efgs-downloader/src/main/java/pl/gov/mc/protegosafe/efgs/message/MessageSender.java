package pl.gov.mc.protegosafe.efgs.message;

import pl.gov.mc.protegosafe.efgs.ProcessedBatches;

import java.util.List;

public interface MessageSender {

    void sendMessage(List<ProcessedBatches> processedBatches);
}
