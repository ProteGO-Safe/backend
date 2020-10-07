package pl.gov.mc.protegosafe.efgs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestService {

    private final FirestoreProvider provideFirestore;
    private final MessageSender messageSender;

    @Autowired
    TestService(FirestoreProvider provideFirestore, MessageSender messageSender) {
        this.provideFirestore = provideFirestore;
        this.messageSender = messageSender;
    }

    String toUpperCase(String value) {
        provideFirestore.provideFirestore();
        messageSender.publishMessage(value);
        return "dupa";
    }
}
