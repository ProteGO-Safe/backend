package pl.gov.mc.protegosafe.efgs.secret;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
@Getter
public class CloudBackendConfig {

    Efgs efgs;

    public String getNbtlsCert() {
        return efgs.nbtlsCert;
    }

    public String getNbbsCert() {
        return efgs.nbbsCert;
    }

    @FieldDefaults(level = AccessLevel.PRIVATE)
    @Getter
    static private class Efgs {
        String nbbsCert;
        String nbtlsCert;
    }
}


