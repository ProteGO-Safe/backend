package pl.gov.mc.protegosafe.efgs.downloder;

import org.junit.jupiter.api.Test;
import pl.gov.mc.protegosafe.efgs.downloader.EfgsDiagnosisKeysDownloader;

class EfgsDiagnosisKeysDownloaderTest {

    @Test
    public void should() {

    	// given
        EfgsDiagnosisKeysDownloader efgsDiagnosisKeysDownloader = new EfgsDiagnosisKeysDownloader();

        // when
        efgsDiagnosisKeysDownloader.accept(null, null);

        // then

    }

}
