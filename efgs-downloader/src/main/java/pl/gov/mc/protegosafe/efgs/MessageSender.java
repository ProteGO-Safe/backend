package pl.gov.mc.protegosafe.efgs;

import com.google.api.core.ApiFuture;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.PubsubMessage;
import com.google.pubsub.v1.TopicName;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

@Service
class MessageSender {

    @SneakyThrows
    void publishMessage(String message) {
        TopicName topicName = TopicName.of("protego-fb-dev", "firebase-test-europe-west1");

        Publisher publisher = Publisher.newBuilder(topicName)
                .build();
        ByteString data = ByteString.copyFromUtf8(message);
        PubsubMessage pubsubMessage = PubsubMessage.newBuilder().setData(data).build();
        ApiFuture<String> messageIdFuture = publisher.publish(pubsubMessage);
        messageIdFuture.get();
    }
}
