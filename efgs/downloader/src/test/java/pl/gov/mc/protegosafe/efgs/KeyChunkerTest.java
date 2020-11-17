package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.Lists;
import eu.interop.federationgateway.model.EfgsProto;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.RandomUtils;
import org.junit.jupiter.api.Test;
import pl.gov.mc.protegosafe.efgs.model.Key;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class KeyChunkerTest {

    private static final int ROLLING_PERIOD = 10;

    @Test
    void shouldCreatePartitionWhenKeysAreOrderedWithoutOverlapping() {

        // given
        Key key1 = createKey(100);
        Key key2 = createKey(110);
        Key key3 = createKey(120);
        Key key4 = createKey(130);
        Key key5 = createKey(140);
        Key key6 = createKey(150);
        Key key7 = createKey(160);
        Key key8 = createKey(170);
        Key key9 = createKey(180);
        Key key10 = createKey(190);
        List<Key> diagnosicKeys = Lists.newArrayList(
                key1,
                key2,
                key3,
                key4,
                key5,
                key6,
                key7,
                key8,
                key9,
                key10
        );

        // when
        KeyChunker keyChunker = KeyChunker.of(diagnosicKeys, 5);

        // then
        assertThat(keyChunker.size()).isEqualTo(2);
        assertThat(keyChunker.get(0)).contains(key1, key2, key3, key4, key5);
        assertThat(keyChunker.get(1)).contains(key6, key7, key8, key9, key10);
    }

    @Test
    void shouldCreatePartitionWhenKeysAreOrderedWithOverlapping() {

        // given
        Key key1 = createKey(100);
        Key key2 = createKey(105);
        Key key3 = createKey(120);
        Key key4 = createKey(130);
        Key key5 = createKey(140);
        Key key6 = createKey(150);
        Key key7 = createKey(160);
        Key key8 = createKey(170);
        Key key9 = createKey(180);
        Key key10 = createKey(190);
        List<Key> diagnosicKeys = Lists.newArrayList(
                key1,
                key2,
                key3,
                key4,
                key5,
                key6,
                key7,
                key8,
                key9,
                key10
        );

        // when
        KeyChunker keyChunker = KeyChunker.of(diagnosicKeys, 5);

        // then
        assertThat(keyChunker.size()).isEqualTo(2);
        assertThat(keyChunker.get(0)).contains(key1, key3, key4, key5, key6);
        assertThat(keyChunker.get(1)).contains(key2, key7, key8, key9, key10);
    }

    @Test
    void shouldCreatePartitionWhenKeysAreNotOrderedWithOverlapping() {

        // given
        Key key1 = createKey(100);
        Key key4 = createKey(130);
        Key key3 = createKey(120);
        Key key6 = createKey(150);
        Key key10 = createKey(190);
        Key key9 = createKey(180);
        Key key5 = createKey(140);
        Key key7 = createKey(160);
        Key key2 = createKey(105);
        Key key8 = createKey(170);
        List<Key> diagnosicKeys = Lists.newArrayList(
                key1,
                key2,
                key3,
                key4,
                key5,
                key6,
                key7,
                key8,
                key9,
                key10
        );

        // when
        KeyChunker keyKeyChunker = KeyChunker.of(diagnosicKeys, 5);

        // then
        assertThat(keyKeyChunker.size()).isEqualTo(2);
        assertThat(keyKeyChunker.get(0)).contains(key1, key3, key4, key5, key6);
        assertThat(keyKeyChunker.get(1)).contains(key2, key7, key8, key9, key10);
    }

    @Test
    void shouldCreatePartitionAllKeysHaveOverlapping() {

        // given
        Key key1 = createKey(100);
        Key key2 = createKey(100);
        Key key3 = createKey(100);
        Key key4 = createKey(100);
        Key key5 = createKey(100);
        Key key6 = createKey(100);
        Key key7 = createKey(100);
        Key key8 = createKey(100);
        Key key9 = createKey(100);
        Key key10 = createKey(100);
        List<Key> diagnosicKeys = Lists.newArrayList(
                key1,
                key2,
                key3,
                key4,
                key5,
                key6,
                key7,
                key8,
                key9,
                key10
        );

        // when
        KeyChunker keyChunker = KeyChunker.of(diagnosicKeys, 5);

        // then
        assertThat(keyChunker.size()).isEqualTo(10);
        assertThat(keyChunker.get(0)).contains(key1);
        assertThat(keyChunker.get(1)).contains(key2);
        assertThat(keyChunker.get(2)).contains(key3);
        assertThat(keyChunker.get(3)).contains(key4);
        assertThat(keyChunker.get(4)).contains(key5);
        assertThat(keyChunker.get(5)).contains(key6);
        assertThat(keyChunker.get(6)).contains(key7);
        assertThat(keyChunker.get(7)).contains(key8);
        assertThat(keyChunker.get(8)).contains(key9);
        assertThat(keyChunker.get(9)).contains(key10);
    }

    private Key createKey(long rollingStartIntervalNumber) {
        return new Key(RandomStringUtils.randomAlphabetic(10), rollingStartIntervalNumber, ROLLING_PERIOD, RandomUtils.nextInt(), EfgsProto.ReportType.CONFIRMED_TEST_VALUE);
    }

}
