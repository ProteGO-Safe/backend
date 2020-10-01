package pl.gov.mc.protegosafe.efgs;

import java.util.function.Predicate;
import java.util.function.Supplier;

public class AssertUtils {

    public static <T> void isTrue(T input, Predicate<T> predicate, Supplier<RuntimeException> runtimeExceptionSupplier) {

        if (!predicate.test(input)) {
            throw runtimeExceptionSupplier.get();
        }
    }

    public static <T> void isFalse(T input, Predicate<T> predicate, Supplier<RuntimeException> runtimeExceptionSupplier) {

        isTrue(input, predicate.negate(), runtimeExceptionSupplier);
    }
}
