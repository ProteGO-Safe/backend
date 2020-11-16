package pl.gov.mc.protegosafe.efgs.message;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import pl.gov.mc.protegosafe.efgs.model.Key;

import java.util.List;


@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
public class Message {
    List<Key> keysData;
}
