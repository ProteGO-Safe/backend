package pl.gov.mc.protegosafe.efgs.message;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.PubsubMessage;
import com.google.pubsub.v1.TopicName;
import lombok.AccessLevel;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.Properties;
import pl.gov.mc.protegosafe.efgs.model.Key;

import java.util.List;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
class PubSubMessageSender implements MessageSender {

    String topicId;
    String projectId;

    @Autowired
    PubSubMessageSender(Properties properties) {
        this.topicId = properties.getMessage().getTopicId();
        this.projectId = properties.getMessage().getProjectId();
    }

    @SneakyThrows
    @Override
    public void sendMessage(List<Key> keys) {
        TopicName topicName = TopicName.of(projectId, topicId);

        Publisher publisher = Publisher.newBuilder(topicName)
                .build();
        ByteString data = ByteString.copyFromUtf8(buildMessage(keys));
        PubsubMessage pubsubMessage = PubsubMessage.newBuilder().setData(data).build();
        ApiFuture<String> messageIdFuture = publisher.publish(pubsubMessage);
        messageIdFuture.get();
        publisher.shutdown();
    }

    @SneakyThrows
    private String buildMessage(List<Key> keys) {
        ObjectMapper objectMapper = new ObjectMapper();
        Message message = new Message(keys);
        return objectMapper.writeValueAsString(message);
    }
}
