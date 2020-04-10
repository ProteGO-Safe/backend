resource "google_vpc_access_connector" "connector" {
  name          = "vpcconn"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = "default"
}
