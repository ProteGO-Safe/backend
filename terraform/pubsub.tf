resource "google_pubsub_topic" "pubsub_send_register_sms_topic" {
  name = "pubsub_send_register_sms_topic"

  message_storage_policy {
    allowed_persistence_regions = [
      var.region,
    ]
  }
}
