variable "project_id" {
  type    = string
}

variable "region" {
  type    = string
  default = "europe-west3"
}


variable "stage" {
  type        = string
  description = "Stage says is this enviromnent is for production or developement.\nThe stage value must be a \"DEVELOPMENT\" or \"PRODUCTION\"."

//  validation {
//    condition     = can(regex("^(DEVELOPMENT|PRODUCTION)$", var.stage))
//    error_message = "The stage value must be a \"DEVELOPMENT\" or \"PRODUCTION\"."
//  }

}

variable "sms_api_token" {
  type      = string
  description = "Token for SMS API"
}

variable "gcp_service_list" {
  type        =  list(string)
  description = "List of GCP service to be enabled for a project."
  default = [
    "bigquery.googleapis.com",            # BigQuery API
    "bigquerystorage.googleapis.com",     # BigQuery Storage API
    "cloudfunctions.googleapis.com",      # CloudFunctions API
    "datastore.googleapis.com",           # Cloud Datastore API
    "pubsub.googleapis.com",              # Cloud Pub/Sub API
    "storage-api.googleapis.com",         # Google Cloud Storage JSON API
    "storage-component.googleapis.com",   # Cloud Storage
    "storagetransfer.googleapis.com",     # Storage Transfer API
  ]
}
