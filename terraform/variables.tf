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
