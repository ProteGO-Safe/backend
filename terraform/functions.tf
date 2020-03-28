locals {
  check_version_source_object_file_name = "check_version-${formatdate("DDMMYYYYhhmmssZZZ", timestamp())}.zip"
  get_status_source_object_file_name    = "get_status-${formatdate("DDMMYYYYhhmmssZZZ", timestamp())}.zip"
}

// START check_version
data "local_file" "check_version" {
    filename = "${path.module}/../functions/check_version/main.py"
}

data "archive_file" "check_version" {
  type        = "zip"
  output_path = "${path.module}/files/check_version-${local.check_version_source_object_file_name}"

  source {
    content   = "${file("${data.local_file.check_version.filename}")}"
    filename  = "main.py"
  }
}

resource "google_storage_bucket_object" "check_version" {
  name        = local.check_version_source_object_file_name
  bucket      = google_storage_bucket.functions.name
  source      = data.archive_file.check_version.output_path
  depends_on  = [data.archive_file.check_version]
}

resource "google_cloudfunctions_function" "check_version" {
  name                  = "check_version"
  runtime               = "python37"
  trigger_http          = true
  entry_point           = "check_version"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.check_version.name
}

resource "google_cloudfunctions_function_iam_member" "invoker-check_version" {
  project        = google_cloudfunctions_function.check_version.project
  region         = google_cloudfunctions_function.check_version.region
  cloud_function = google_cloudfunctions_function.check_version.name
  role            = "roles/cloudfunctions.invoker"
  member          = "allUsers"
}
// END check_version


// START get_status
data "local_file" "get_status" {
    filename = "${path.module}/../functions/get_status/main.py"
}

data "archive_file" "get_status" {
  type        = "zip"
  output_path = "${path.module}/files/get_status-${local.get_status_source_object_file_name}"

  source {
    content   = "${file("${data.local_file.get_status.filename}")}"
    filename  = "main.py"
  }
}

resource "google_storage_bucket_object" "get_status" {
  name        = local.get_status_source_object_file_name
  bucket      = google_storage_bucket.functions.name
  source      = data.archive_file.get_status.output_path
  depends_on  = [data.archive_file.get_status]
}

resource "google_cloudfunctions_function" "get_status" {
  name                  = "get_status"
  runtime               = "python37"
  trigger_http          = true
  entry_point           = "get_status"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.get_status.name
}

resource "google_cloudfunctions_function_iam_member" "invoker-get_status" {
  project        = google_cloudfunctions_function.get_status.project
  region         = google_cloudfunctions_function.get_status.region
  cloud_function = google_cloudfunctions_function.get_status.name
  role            = "roles/cloudfunctions.invoker"
  member          = "allUsers"
}
// END get_status function
