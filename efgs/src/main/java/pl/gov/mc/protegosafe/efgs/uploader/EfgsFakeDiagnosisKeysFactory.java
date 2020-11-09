package pl.gov.mc.protegosafe.efgs.uploader;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;
import pl.gov.mc.protegosafe.efgs.uploader.model.DiagnosisKey;
import pl.gov.mc.protegosafe.efgs.uploader.model.ReportType;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.IntStream;

public class EfgsFakeDiagnosisKeysFactory {

    public static List<DiagnosisKey> fillFakesDiagnosisKeys(List<DiagnosisKey> diagnosisKeys, int fillTo) {
        List<DiagnosisKey> fakeDiagnosisKeys = Lists.newArrayList(diagnosisKeys);

        IntStream.range(0, fillTo - diagnosisKeys.size())
                .forEach(i -> {
                    DiagnosisKey diagnosisKey = generateFakeDiagnosisKey();
                    fakeDiagnosisKeys.add(diagnosisKey);
                });

        Collections.shuffle(fakeDiagnosisKeys);

        return ImmutableList.copyOf(fakeDiagnosisKeys);
    }

    private static DiagnosisKey generateFakeDiagnosisKey() {
        int currentTimestamp = (int) (System.currentTimeMillis() / 1000);

        return new DiagnosisKey(
                generateRandomKey(),
                ThreadLocalRandom.current().nextInt(currentTimestamp - 1296000000, currentTimestamp + 1),
                ThreadLocalRandom.current().nextInt(1, 144 + 1),
                ThreadLocalRandom.current().nextInt(1, 8 + 1),
                Collections.emptyList(),
                "origin",
                randomReportType(),
                DiagnosisKey.DAYS_SINCE_ONSET_OF_SYMPTOMS
        );
    }

    private static ReportType randomReportType() {
        int type = ThreadLocalRandom.current().nextInt(1, 2 + 1);

        switch (type) {
            case 1:
                return ReportType.CONFIRMED_CLINICAL_DIAGNOSIS;
            case 2:
                return ReportType.CONFIRMED_TEST;
        }

        return ReportType.CONFIRMED_TEST;
    }

    private static String generateRandomKey() {
        byte[] bytes = new byte[16];
        new Random().nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }
}
