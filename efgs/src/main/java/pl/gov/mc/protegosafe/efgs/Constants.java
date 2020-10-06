package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.Lists;

import java.util.List;

public class Constants {

    public static final String ENV_EFGS_URL = "EFGS_URL";
    public static final String ENV_NBBS_LOCATION = "NBBS_LOCATION";
    public static final String ENV_NBTLS_LOCATION = "NBTLS_LOCATION";
    public static final List<String> TEK_VISITED_COUNTRIES = Lists.newArrayList("PL");
    public static final String TEK_ORIGIN = "de";
    public static final int TEK_DAYS_SINCE_ONSET_OF_SYMPTOMS = 42;
}
