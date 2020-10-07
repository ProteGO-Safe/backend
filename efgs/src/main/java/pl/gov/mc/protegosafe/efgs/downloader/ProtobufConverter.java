package pl.gov.mc.protegosafe.efgs.downloader;

import com.google.protobuf.ByteString;
import com.google.protobuf.Descriptors;
import com.google.protobuf.ExtensionRegistry;
import com.google.protobuf.Message;
import com.googlecode.protobuf.format.JsonFormat;
import lombok.SneakyThrows;

import java.util.Base64;

class ProtobufConverter extends JsonFormat {

    private static ProtobufConverter instance;

    synchronized static ProtobufConverter getInstance() {
        if (instance == null) {
            instance = new ProtobufConverter();
        }
        return instance;
    }

    private ProtobufConverter() {
    }

    @SneakyThrows
    @Override
    public void printField(Descriptors.FieldDescriptor field, Object value, JsonGenerator generator) {
        if (field.getType() == Descriptors.FieldDescriptor.Type.BYTES && !field.isRepeated()) {
            generator.print("\"" + field.getName() + "\": \"");

            ByteString byteString = (ByteString) value;
            generator.print(Base64.getEncoder().encodeToString(byteString.toByteArray()));

            generator.print("\"");
        } else {
            super.printField(field, value, generator);
        }
    }

    @SneakyThrows
    @Override
    protected void mergeField(Tokenizer tokenizer, ExtensionRegistry extensionRegistry, Message.Builder builder) {

        Descriptors.Descriptor type = builder.getDescriptorForType();
        String name = tokenizer.currentToken().replaceAll("\"|'", "");
        Descriptors.FieldDescriptor field = type.findFieldByName(name);

        if (field != null && field.getType() == Descriptors.FieldDescriptor.Type.BYTES) {
            tokenizer.consumeIdentifier();
            tokenizer.consume(":");
            byte[] value = Base64.getDecoder().decode(tokenizer.consumeString());
            builder.setField(field, ByteString.copyFrom(value));

            if (tokenizer.tryConsume(",")) {
                mergeField(tokenizer, extensionRegistry, builder);
            }

        } else {
            super.mergeField(tokenizer, extensionRegistry, builder);
        }
    }
}
