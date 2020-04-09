resource "google_redis_instance" "rate_limiting_storage" {
  name                    = "rate-limiting-storage"
  memory_size_gb          = 1
  depends_on = [google_vpc_access_connector.connector]
}
