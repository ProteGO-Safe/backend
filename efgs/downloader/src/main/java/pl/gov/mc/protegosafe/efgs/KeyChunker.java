package pl.gov.mc.protegosafe.efgs;

import com.google.common.collect.ImmutableList;
import pl.gov.mc.protegosafe.efgs.model.Key;

import java.util.*;

import static com.google.common.collect.Lists.newArrayList;
import static com.google.common.collect.Maps.newHashMap;

class KeyChunker extends AbstractList<List<Key>> {

    private final Map<Integer, List<Key>> chunks;
    private final int chunkSize;

    private KeyChunker(int chunkSize) {
        this.chunks = newHashMap();
        this.chunkSize = chunkSize;
    }

    static KeyChunker of(List<Key> keys, int chunkSize) {
        KeyChunker keyChunker = new KeyChunker(chunkSize);

        keys.forEach(keyChunker::prepare);

        return keyChunker;
    }

    private void prepare(Key key) {
        long rollingStartIntervalNumber = key.getRollingStartIntervalNumber();
        chunks.values()
                .stream()
                .filter(integerListEntry -> hasMatchedRollingStartInterval(integerListEntry, rollingStartIntervalNumber))
                .findFirst()
                .ifPresentOrElse(keys -> keys.add(key), () -> createNewChunk(key));
    }

    private void createNewChunk(Key key) {
        List<Key> keys = newArrayList(key);
        chunks.put(chunks.size(), keys);
    }

    private boolean hasMatchedRollingStartInterval(List<Key> value, long rollingStartIntervalNumber) {

        if (value.size() == chunkSize) {
            return false;
        }

        return value.stream()
                .map(this::countIntervalWithPeriod)
                .noneMatch(intervalWithPeriod-> intervalWithPeriod > rollingStartIntervalNumber);
    }

    private long countIntervalWithPeriod(Key key) {
        return key.getRollingStartIntervalNumber() + key.getRollingPeriod();
    }

    @Override
    public List<Key> get(int index) {
        return ImmutableList.copyOf(chunks.get(index));
    }

    @Override
    public int size() {
        return chunks.size();
    }

    long amountOfKeys() {
        return chunks.values()
                .stream()
                .mapToInt(List::size)
                .sum();
    }
}
