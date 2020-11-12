package pl.gov.mc.protegosafe.efgs.repository;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import pl.gov.mc.protegosafe.efgs.Properties;

import java.time.LocalDate;
import java.util.List;

@Disabled
class FirestoreRepositoryTest {

    private FirestoreRepository firestoreRepository;

    @BeforeEach
    void beforeEach() {
        MockitoAnnotations.openMocks(this);
        Properties properties = new Properties();
        Properties.Downloader downloader = new Properties.Downloader();
        Properties.Downloader.Db db = new Properties.Downloader.Db();
        Properties.Downloader.Db.Collections collections = new Properties.Downloader.Db.Collections();
        collections.setBatchTag("processedBatchTags");
        db.setCollections(collections);
        downloader.setDb(db);
        properties.setDownloader(downloader);
        firestoreRepository = new FirestoreRepository(provideFirestore(), properties);
    }

    @Test
    void shouldListLastProcessedDate() {

    	// given

    	// when
        List<ProcessedDate> processedDates = firestoreRepository.listLastProcessedDate(10);

        // then
        System.out.println(processedDates);

    }

    @Test
    void shouldMarkDateAsProcessed() {

        // given

        // when
        firestoreRepository.markDateAsProcessed(LocalDate.parse("2020-10-22"));

        // then
        System.out.println();
    }

    @Test
    void shouldFetchLastProcessedBatchTag() {

        // given

        // when
        FirestoreBatchTag firestoreBatchTag = firestoreRepository.fetchLastProcessedBatchTag(LocalDate.parse("2020-11-08"));

        // then
        System.out.println(firestoreBatchTag);

    }

    @SneakyThrows
    Firestore provideFirestore() {
        FirestoreOptions firestoreOptions =
                FirestoreOptions.getDefaultInstance().toBuilder()
                        .setProjectId("")
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
        return firestoreOptions.getService();
    }

}