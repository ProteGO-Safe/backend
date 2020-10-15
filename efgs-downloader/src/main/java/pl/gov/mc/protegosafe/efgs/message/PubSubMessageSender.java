package pl.gov.mc.protegosafe.efgs.message;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.pubsub.v1.Publisher;
import com.google.protobuf.ByteString;
import com.google.pubsub.v1.PubsubMessage;
import com.google.pubsub.v1.TopicName;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import pl.gov.mc.protegosafe.efgs.ProcessedBatches;
import pl.gov.mc.protegosafe.efgs.Properties;

import java.util.List;

@Service
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@AllArgsConstructor
class PubSubMessageSender implements MessageSender {

    Properties properties;

    @SneakyThrows
    @Override
    public void sendMessage(List<ProcessedBatches> processedBatches) {
        TopicName topicName = TopicName.of(properties.getMessage().getProjectId(), properties.getMessage().getTopicId());

        Publisher publisher = Publisher.newBuilder(topicName)
                .build();
        ByteString data = ByteString.copyFromUtf8(buildMessage(processedBatches));
        PubsubMessage pubsubMessage = PubsubMessage.newBuilder().setData(data).build();
        ApiFuture<String> messageIdFuture = publisher.publish(pubsubMessage);
        messageIdFuture.get();
    }

    @SneakyThrows
    private String buildMessage(List<ProcessedBatches> processedBatches) {
        ObjectMapper objectMapper = new ObjectMapper();
        Message message = new Message(processedBatches);
        return objectMapper.writeValueAsString(message);
    }
}
