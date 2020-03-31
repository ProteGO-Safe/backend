resource "google_storage_bucket" "functions" {
  name          = "${var.project_id}-functions"
  location      = var.region
  force_destroy = true

  versioning {
    enabled = "true"
  }
}
