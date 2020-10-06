package pl.gov.mc.protegosafe.efgs.downloader;

import com.google.cloud.functions.*;
import com.google.pubsub.v1.PubsubMessage;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.util.List;


@Slf4j
public class EfgsDiagnosisKeysDownloader implements BackgroundFunction<PubsubMessage>, HttpFunction {

    @Override
    public void accept(PubsubMessage pubsubMessage, Context context) {


    }

    @Override
    public void service(HttpRequest httpRequest, HttpResponse httpResponse) {

        log.info("handle request");

        List<String> strings = HttpDownloader.downloadAllDiagnosisKeyBatchesForDate(LocalDate.now(), null);

        log.info("downloaded diagnosis keys, {}", strings);
    }
}
