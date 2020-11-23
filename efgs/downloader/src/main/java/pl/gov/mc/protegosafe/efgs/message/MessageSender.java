package pl.gov.mc.protegosafe.efgs.message;

import pl.gov.mc.protegosafe.efgs.model.Key;

import java.util.List;

public interface MessageSender {
    void sendMessage(List<Key> keys, String batchTag);
}
