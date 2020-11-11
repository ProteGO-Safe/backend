package pl.gov.mc.protegosafe.efgs.uploader;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

class EfgsFakeDiagnosisKeysFactory {

    static List<DiagnosisKey> fillFakesDiagnosisKeys(List<DiagnosisKey> diagnosisKeys, int fillTo) {
        List<DiagnosisKey> fakeDiagnosisKeys = Lists.newArrayList(diagnosisKeys);

        IntStream.range(0, fillTo - diagnosisKeys.size())
                .forEach(i -> fakeDiagnosisKeys.add(DiagnosisKey.random()));

        Collections.shuffle(fakeDiagnosisKeys);

        return ImmutableList.copyOf(fakeDiagnosisKeys);
    }
}
