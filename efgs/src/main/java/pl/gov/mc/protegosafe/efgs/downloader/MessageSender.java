package pl.gov.mc.protegosafe.efgs.downloader;

import com.google.api.core.ApiFuture;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.PubsubMessage;
import com.google.pubsub.v1.TopicName;
import lombok.SneakyThrows;

import static pl.gov.mc.protegosafe.efgs.Constants.ENV_PROCESSED_BATCHES_TOPIC_ID;
import static pl.gov.mc.protegosafe.efgs.Constants.ENV_PROJECT_ID;

class MessageSender {

    @SneakyThrows
    static void publishMessage(String message) {
        TopicName topicName = TopicName.of(ENV_PROJECT_ID, ENV_PROCESSED_BATCHES_TOPIC_ID);

        Publisher publisher = Publisher.newBuilder(topicName)
                .build();
        ByteString data = ByteString.copyFromUtf8(message);
        PubsubMessage pubsubMessage = PubsubMessage.newBuilder().setData(data).build();
        ApiFuture<String> messageIdFuture = publisher.publish(pubsubMessage);
        messageIdFuture.get();
    }
}
