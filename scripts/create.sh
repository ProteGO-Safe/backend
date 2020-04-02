#!/usr/bin/env bash

# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# Stop immediately if something goes wrong
set -euo pipefail


run_terraform() {
  # Init with backend on gcs bucket
  (cd "$ROOT/terraform"; terraform init \
    -input=false \
    -backend-config="bucket=${PROJECT}-tfstate")

  # Show plan
  (cd "$ROOT/terraform"; terraform plan \
    -input=false \
    -var "project_id=${PROJECT}" \
    -var "stage=${STAGE}" \
    -var "sms_api_token=${SMS_API_TOKEN}")

  # Apply
  (cd "$ROOT/terraform"; terraform apply \
    -input=false \
    -auto-approve \
    -var "project_id=${PROJECT}" \
    -var "stage=${STAGE}" \
    -var "sms_api_token=${SMS_API_TOKEN}")
}


ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
# shellcheck source=scripts/common.sh
source "$ROOT/scripts/common.sh"

check_dependency_installed gcloud
check_dependency_installed terraform

get_project

# Ask
echo
echo "Do you want to run \"terraform apply\" on project: \"${PROJECT}\" ?"
ask_for_confirmation
echo

get_terraform_backend_bucket

# Check variables
check_variable_set "PROJECT"
check_variable_set "STAGE"
check_variable_set "SMS_API_TOKEN"
check_stage_variable_set

# Enable required GCP services
enable_project_api "${PROJECT}" bigquery.googleapis.com
enable_project_api "${PROJECT}" bigquerystorage.googleapis.com
enable_project_api "${PROJECT}" cloudfunctions.googleapis.com
enable_project_api "${PROJECT}" datastore.googleapis.com
enable_project_api "${PROJECT}" pubsub.googleapis.com
enable_project_api "${PROJECT}" storage-api.googleapis.com
enable_project_api "${PROJECT}" storage-component.googleapis.com
enable_project_api "${PROJECT}" storagetransfer.googleapis.com


run_terraform
