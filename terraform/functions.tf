locals {
  source_object_file_name_prefix = "${var.region}/${var.project_id}/"
}


// START check_version
data "local_file" "check_version" {
  filename = "${path.module}/../functions/check_version/main.py"
}

data "archive_file" "check_version" {
  type        = "zip"
  output_path = "${path.module}/files/check_version.zip"

  source {
    content  = "${file("${data.local_file.check_version.filename}")}"
    filename = "main.py"
  }
}

resource "google_storage_bucket_object" "check_version" {
  // we append hash to the filename as a temporary workaround for https://github.com/terraform-providers/terraform-provider-google/issues/1938
  name       = "${local.source_object_file_name_prefix}check_version-${lower(replace(base64encode(data.archive_file.check_version.output_md5), "=", ""))}.zip"
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

data "local_file" "confirm_registration_messages" {
  filename = "${path.module}/../functions/confirm_registration/messages.json"
}

data "archive_file" "confirm_registration" {
  type        = "zip"
  output_path = "${path.module}/files/confirm_registration.zip"

  source {
    content  = "${file("${data.local_file.confirm_registration_main.filename}")}"
    filename = "main.py"
  }

  source {
    content  = "${file("${data.local_file.confirm_registration_requirements.filename}")}"
    filename = "requirements.txt"
  }

  source {
    content  = "${file("${data.local_file.confirm_registration_messages.filename}")}"
    filename = "messages.json"
  }
}

resource "google_storage_bucket_object" "confirm_registration" {
  // we append hash to the filename as a temporary workaround for https://github.com/terraform-providers/terraform-provider-google/issues/1938
  name       = "${local.source_object_file_name_prefix}confirm_registration-${lower(replace(base64encode(data.archive_file.confirm_registration.output_md5), "=", ""))}.zip"
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

data "local_file" "get_status_messages" {
  filename = "${path.module}/../functions/get_status/messages.json"
}

data "archive_file" "get_status" {
  type        = "zip"
  output_path = "${path.module}/files/get_status.zip"

  source {
    content  = "${file("${data.local_file.get_status_main.filename}")}"
    filename = "main.py"
  }

  source {
    content  = "${file("${data.local_file.get_status_requirements.filename}")}"
    filename = "requirements.txt"
  }

  source {
    content  = "${file("${data.local_file.get_status_messages.filename}")}"
    filename = "messages.json"
  }

}

resource "google_storage_bucket_object" "get_status" {
  // we append hash to the filename as a temporary workaround for https://github.com/terraform-providers/terraform-provider-google/issues/1938
  name       = "${local.source_object_file_name_prefix}get_status-${lower(replace(base64encode(data.archive_file.get_status.output_md5), "=", ""))}.zip"
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

// START send_encounters
data "local_file" "send_encounters_main" {
  filename = "${path.module}/../functions/send_encounters/main.py"
}

data "local_file" "send_encounters_requirements" {
  filename = "${path.module}/../functions/send_encounters/requirements.txt"
}

data "archive_file" "send_encounters" {
  type        = "zip"
  output_path = "${path.module}/files/send_encounters.zip"

  source {
    content  = "${file("${data.local_file.send_encounters_main.filename}")}"
    filename = "main.py"
  }

  source {
    content  = "${file("${data.local_file.send_encounters_requirements.filename}")}"
    filename = "requirements.txt"
  }

}

resource "google_storage_bucket_object" "send_encounters" {
  // we append hash to the filename as a temporary workaround for https://github.com/terraform-providers/terraform-provider-google/issues/1938
  name       = "${local.source_object_file_name_prefix}send_encounters-${lower(replace(base64encode(data.archive_file.send_encounters.output_md5), "=", ""))}.zip"
  bucket     = google_storage_bucket.functions.name
  source     = data.archive_file.send_encounters.output_path
  depends_on = [data.archive_file.send_encounters]
}

resource "google_cloudfunctions_function" "send_encounters" {
  name                  = "send_encounters"
  runtime               = "python37"
  trigger_http          = true
  entry_point           = "send_encounters"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.send_encounters.name

  environment_variables = {
    BQ_DATASET = google_bigquery_dataset.protego_main_dataset.dataset_id
    BQ_TABLE   = google_bigquery_table.encounters.table_id
  }

}

resource "google_cloudfunctions_function_iam_member" "invoker-send_encounters" {
  project        = google_cloudfunctions_function.send_encounters.project
  region         = google_cloudfunctions_function.send_encounters.region
  cloud_function = google_cloudfunctions_function.send_encounters.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
// END send_encounters function


// START register
data "local_file" "register_main" {
  filename = "${path.module}/../functions/register/main.py"
}

data "local_file" "register_requirements" {
  filename = "${path.module}/../functions/register/requirements.txt"
}


data "local_file" "register_messages" {
  filename = "${path.module}/../functions/register/messages.json"
}

data "archive_file" "register" {
  type        = "zip"
  output_path = "${path.module}/files/register.zip"

  source {
    content  = "${file("${data.local_file.register_main.filename}")}"
    filename = "main.py"
  }

  source {
    content  = "${file("${data.local_file.register_requirements.filename}")}"
    filename = "requirements.txt"
  }

  source {
    content  = "${file("${data.local_file.register_messages.filename}")}"
    filename = "messages.json"
  }
}

resource "google_storage_bucket_object" "register" {
  // we append hash to the filename as a temporary workaround for https://github.com/terraform-providers/terraform-provider-google/issues/1938
  name       = "${local.source_object_file_name_prefix}register-${lower(replace(base64encode(data.archive_file.register.output_md5), "=", ""))}.zip"
  bucket     = google_storage_bucket.functions.name
  source     = data.archive_file.register.output_path
  depends_on = [data.archive_file.register]
}

resource "google_cloudfunctions_function" "register" {
  name                  = "register"
  runtime               = "python37"
  trigger_http          = true
  entry_point           = "register"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.register.name

  environment_variables = {
    PUBSUB_SEND_REGISTER_SMS_TOPIC = google_pubsub_topic.pubsub_send_register_sms_topic.name
    STAGE                          = var.stage
  }

  depends_on = [google_pubsub_topic.pubsub_send_register_sms_topic]
}

resource "google_cloudfunctions_function_iam_member" "invoker-register" {
  project        = google_cloudfunctions_function.register.project
  region         = google_cloudfunctions_function.register.region
  cloud_function = google_cloudfunctions_function.register.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
// END register

// START register_no_msisdn
data "local_file" "register_no_msisdn_main" {
  filename = "${path.module}/../functions/register_no_msisdn/main.py"
}

data "local_file" "register_no_msisdn_requirements" {
  filename = "${path.module}/../functions/register_no_msisdn/requirements.txt"
}

data "archive_file" "register_no_msisdn" {
  type        = "zip"
  output_path = "${path.module}/files/register_no_msisdn.zip"

  source {
    content  = "${file("${data.local_file.register_no_msisdn_main.filename}")}"
    filename = "main.py"
  }

  source {
    content  = "${file("${data.local_file.register_no_msisdn_requirements.filename}")}"
    filename = "requirements.txt"
  }
}

resource "google_storage_bucket_object" "register_no_msisdn" {
  // we append hash to the filename as a temporary workaround for https://github.com/terraform-providers/terraform-provider-google/issues/1938
  name       = "${local.source_object_file_name_prefix}register_no_msisdn-${lower(replace(base64encode(data.archive_file.register_no_msisdn.output_md5), "=", ""))}.zip"
  bucket     = google_storage_bucket.functions.name
  source     = data.archive_file.register_no_msisdn.output_path
  depends_on = [data.archive_file.register_no_msisdn]
}

resource "google_cloudfunctions_function" "register_no_msisdn" {
  name                  = "register_no_msisdn"
  runtime               = "python37"
  trigger_http          = true
  entry_point           = "register_no_msisdn"
  source_archive_bucket = google_storage_bucket.functions.name
  source_archive_object = google_storage_bucket_object.register_no_msisdn.name
}

resource "google_cloudfunctions_function_iam_member" "invoker-register_no_msisdn" {
  project        = google_cloudfunctions_function.register_no_msisdn.project
  region         = google_cloudfunctions_function.register_no_msisdn.region
  cloud_function = google_cloudfunctions_function.register_no_msisdn.name
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
// END register_no_msisdn


// START send_register_sms
data "local_file" "send_register_sms_main" {
  filename = "${path.module}/../functions/send_register_sms/main.py"
}

data "local_file" "send_register_sms_requirements" {
  filename = "${path.module}/../functions/send_register_sms/requirements.txt"
}

data "archive_file" "send_register_sms" {
  type        = "zip"
  output_path = "${path.module}/files/send_register_sms.zip"

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
  // we append hash to the filename as a temporary workaround for https://github.com/terraform-providers/terraform-provider-google/issues/1938
  name       = "${local.source_object_file_name_prefix}send_register_sms-${lower(replace(base64encode(data.archive_file.send_register_sms.output_md5), "=", ""))}.zip"
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
