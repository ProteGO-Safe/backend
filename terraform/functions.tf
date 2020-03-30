locals {
  check_version_source_object_file_name        = "check_version-${var.project_id}-${var.region}-${var.project_id}-${var.region}-${formatdate("DDMMYYYYhhmmssZZZ", timestamp())}.zip"
  get_status_source_object_file_name           = "get_status-${var.project_id}-${var.region}-${formatdate("DDMMYYYYhhmmssZZZ", timestamp())}.zip"
  confirm_registration_source_object_file_name = "confirm_registration-${var.project_id}-${var.region}-${formatdate("DDMMYYYYhhmmssZZZ", timestamp())}.zip"
  register_device_source_object_file_name      = "register_device-${var.project_id}-${var.region}-${formatdate("DDMMYYYYhhmmssZZZ", timestamp())}.zip"
  send_register_sms_source_object_file_name    = "send_register_sms-${var.project_id}-${var.region}-${formatdate("DDMMYYYYhhmmssZZZ", timestamp())}.zip"
}


// START check_version
data "local_file" "check_version" {
  filename = "${path.module}/../functions/check_version/main.py"
}

data "archive_file" "check_version" {
  type        = "zip"
  output_path = "${path.module}/files/check_version-${local.check_version_source_object_file_name}"

  source {
    content  = "${file("${data.local_file.check_version.filename}")}"
    filename = "main.py"
  }
}

resource "google_storage_bucket_object" "check_version" {
  name       = local.check_version_source_object_file_name
  bucket     = google_storage_bucket.functions.name
  source     = data.archive_file.check_version.output_path
  depends_on = [data.archive_file.check_version]
}

resource "google_cloudfunctions_function" "check_version" {
  name                  = "check_version"
  runtime               = "python37"
  trigger_http          = true
  entry_point           = "check_version"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.check_version.name
  depends_on            = [google_project_service.gcp_services]
}

resource "google_cloudfunctions_function_iam_member" "invoker-check_version" {
  project        = google_cloudfunctions_function.check_version.project
  region         = google_cloudfunctions_function.check_version.region
  cloud_function = google_cloudfunctions_function.check_version.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
// END check_version


// START confirm_registration
data "local_file" "confirm_registration_main" {
  filename = "${path.module}/../functions/confirm_registration/main.py"
}

data "local_file" "confirm_registration_requirements" {
  filename = "${path.module}/../functions/confirm_registration/requirements.txt"
}

data "archive_file" "confirm_registration" {
  type        = "zip"
  output_path = "${path.module}/files/confirm_registration-${local.confirm_registration_source_object_file_name}"

  source {
    content  = "${file("${data.local_file.confirm_registration_main.filename}")}"
    filename = "main.py"
  }

  source {
    content  = "${file("${data.local_file.confirm_registration_requirements.filename}")}"
    filename = "requirements.txt"
  }
}

resource "google_storage_bucket_object" "confirm_registration" {
  name       = local.confirm_registration_source_object_file_name
  bucket     = google_storage_bucket.functions.name
  source     = data.archive_file.confirm_registration.output_path
  depends_on = [data.archive_file.confirm_registration]
}

resource "google_cloudfunctions_function" "confirm_registration" {
  name                  = "confirm_registration"
  runtime               = "python37"
  trigger_http          = true
  entry_point           = "confirm_registration"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.confirm_registration.name
}

resource "google_cloudfunctions_function_iam_member" "invoker-confirm_registration" {
  project        = google_cloudfunctions_function.confirm_registration.project
  region         = google_cloudfunctions_function.confirm_registration.region
  cloud_function = google_cloudfunctions_function.confirm_registration.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
// END confirm_registration


// START get_status
data "local_file" "get_status_main" {
  filename = "${path.module}/../functions/get_status/main.py"
}

data "local_file" "get_status_requirements" {
  filename = "${path.module}/../functions/get_status/requirements.txt"
}

data "archive_file" "get_status" {
  type        = "zip"
  output_path = "${path.module}/files/get_status-${local.get_status_source_object_file_name}"

  source {
    content  = "${file("${data.local_file.get_status_main.filename}")}"
    filename = "main.py"
  }

  source {
    content  = "${file("${data.local_file.get_status_requirements.filename}")}"
    filename = "requirements.txt"
  }

}

resource "google_storage_bucket_object" "get_status" {
  name       = local.get_status_source_object_file_name
  bucket     = google_storage_bucket.functions.name
  source     = data.archive_file.get_status.output_path
  depends_on = [data.archive_file.get_status]
}

resource "google_cloudfunctions_function" "get_status" {
  name                  = "get_status"
  runtime               = "python37"
  trigger_http          = true
  entry_point           = "get_status"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.get_status.name

  environment_variables = {
    BQ_DATASET = google_bigquery_dataset.protego_main_dataset.dataset_id
    BQ_TABLE   = google_bigquery_table.beacons.table_id
  }

}

resource "google_cloudfunctions_function_iam_member" "invoker-get_status" {
  project        = google_cloudfunctions_function.get_status.project
  region         = google_cloudfunctions_function.get_status.region
  cloud_function = google_cloudfunctions_function.get_status.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
// END get_status function


// START register_device
data "local_file" "register_device_main" {
  filename = "${path.module}/../functions/register_device/main.py"
}

data "local_file" "register_device_requirements" {
  filename = "${path.module}/../functions/register_device/requirements.txt"
}

data "archive_file" "register_device" {
  type        = "zip"
  output_path = "${path.module}/files/register_device-${local.register_device_source_object_file_name}"

  source {
    content  = "${file("${data.local_file.register_device_main.filename}")}"
    filename = "main.py"
  }

  source {
    content  = "${file("${data.local_file.register_device_requirements.filename}")}"
    filename = "requirements.txt"
  }
}

resource "google_storage_bucket_object" "register_device" {
  name       = local.register_device_source_object_file_name
  bucket     = google_storage_bucket.functions.name
  source     = data.archive_file.register_device.output_path
  depends_on = [data.archive_file.register_device]
}

resource "google_cloudfunctions_function" "register_device" {
  name                  = "register_device"
  runtime               = "python37"
  trigger_http          = true
  entry_point           = "register_device"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.register_device.name

  environment_variables = {
    PUBSUB_SEND_REGISTER_SMS_TOPIC = google_pubsub_topic.pubsub_send_register_sms_topic.name
    STAGE                          = var.stage
  }

  depends_on = [google_pubsub_topic.pubsub_send_register_sms_topic]
}

resource "google_cloudfunctions_function_iam_member" "invoker-register_device" {
  project        = google_cloudfunctions_function.register_device.project
  region         = google_cloudfunctions_function.register_device.region
  cloud_function = google_cloudfunctions_function.register_device.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
// END register_device


// START send_register_sms
data "local_file" "send_register_sms_main" {
  filename = "${path.module}/../functions/send_register_sms/main.py"
}

data "local_file" "send_register_sms_requirements" {
  filename = "${path.module}/../functions/send_register_sms/requirements.txt"
}

data "archive_file" "send_register_sms" {
  type        = "zip"
  output_path = "${path.module}/files/send_register_sms-${local.send_register_sms_source_object_file_name}"

  source {
    content  = "${file("${data.local_file.send_register_sms_main.filename}")}"
    filename = "main.py"
  }

  source {
    content  = "${file("${data.local_file.send_register_sms_requirements.filename}")}"
    filename = "requirements.txt"
  }
}

resource "google_storage_bucket_object" "send_register_sms" {
  name       = local.send_register_sms_source_object_file_name
  bucket     = google_storage_bucket.functions.name
  source     = data.archive_file.send_register_sms.output_path
  depends_on = [data.archive_file.send_register_sms]
}

resource "google_cloudfunctions_function" "send_register_sms" {
  name                  = "send_register_sms"
  runtime               = "python37"
  entry_point           = "send_register_sms"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.send_register_sms.name

  environment_variables = {
    SMS_API_TOKEN = var.sms_api_token
  }

  event_trigger {
    event_type = "google.pubsub.topic.publish"
    resource   = google_pubsub_topic.pubsub_send_register_sms_topic.name
  }

  depends_on = [google_pubsub_topic.pubsub_send_register_sms_topic]
}

resource "google_cloudfunctions_function_iam_member" "invoker-send_register_sms" {
  project        = google_cloudfunctions_function.send_register_sms.project
  region         = google_cloudfunctions_function.send_register_sms.region
  cloud_function = google_cloudfunctions_function.send_register_sms.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
// END send_register_sms
