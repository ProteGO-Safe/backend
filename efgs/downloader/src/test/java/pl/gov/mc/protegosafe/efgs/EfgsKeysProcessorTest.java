package pl.gov.mc.protegosafe.efgs;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@Disabled
@SpringBootTest
class EfgsKeysProcessorTest {

    @Autowired
    private EfgsKeysProcessor efgsKeysProcessor;

    @Test
    public void shouldProcessDownloadKeysFromEfgs() {

    	// given

    	// when
        efgsKeysProcessor.process();

    	// then

    }

}