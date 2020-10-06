package pl.gov.mc.protegosafe.efgs.uploader.model;

import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Setter
class Array<Type> {

    private ArrayValue<Type> arrayValue;

    List<Type> getArrayValue() {
        return arrayValue.values;
    }

    @Setter
    private static class ArrayValue<Type> {

        private ArrayList<Type> values;
    }
}
