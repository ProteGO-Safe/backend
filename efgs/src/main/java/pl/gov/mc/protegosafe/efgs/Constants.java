package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.Lists;

import java.util.List;

public class Constants {

    public static final String ENV_EFGS_URL = System.getenv("EFGS_URL");
    public static final String ENV_NBBS_LOCATION = System.getenv("NBBS_LOCATION");
    public static final String ENV_NBTLS_LOCATION = System.getenv("NBTLS_LOCATION");
    public static final String ENV_PROJECT_ID = System.getenv("PROJECT_ID");
    public static final String ENV_PROCESSED_BATCHES_TOPIC_ID = System.getenv("PROCESSED_BATCHES_TOPIC_ID");
    public static final List<String> TEK_VISITED_COUNTRIES = Lists.newArrayList("DE");
    public static final String TEK_ORIGIN = "pl";
    public static final String X_SSL_CLIENT_DN = "pl";
    public static final int TEK_DAYS_SINCE_ONSET_OF_SYMPTOMS = 42;
    public static final String PROCESSED_BATCH_TAGS_COLLECTION = "processedBatchTags";
}
