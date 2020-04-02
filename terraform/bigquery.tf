resource "google_bigquery_dataset" "protego_main_dataset" {
  dataset_id  = "protego_main_dataset"
  description = "Main protego dataset"
  location    = var.region
}

data "local_file" "bq_table_schema" {
  filename = "${path.module}/../functions/get_status/bq_table_schema.json"
}

resource "google_bigquery_table" "beacons" {
  dataset_id = google_bigquery_dataset.protego_main_dataset.dataset_id
  table_id   = "beacons"

  schema = file("${data.local_file.bq_table_schema.filename}")
}
