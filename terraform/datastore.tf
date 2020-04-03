resource "google_datastore_index" "Registrations1" {
  kind = "Registrations"
  properties {
    name = "ip"
    direction = "ASCENDING"
  }
  properties {
    name = "status"
    direction = "ASCENDING"
  }
  properties {
    name = "date"
    direction = "DESCENDING"
  }
}

resource "google_datastore_index" "Registrations2" {
  kind = "Registrations"
  properties {
    name = "msisdn"
    direction = "ASCENDING"
  }
  properties {
    name = "status"
    direction = "ASCENDING"
  }
  properties {
    name = "date"
    direction = "DESCENDING"
  }
}

resource "google_datastore_index" "Registrations3" {
  kind = "Registrations"
  properties {
    name = "msisdn"
    direction = "ASCENDING"
  }
  properties {
    name = "date"
    direction = "DESCENDING"
  }
}

resource "google_datastore_index" "Registrations4" {
  kind = "Registrations"
  properties {
    name = "ip"
    direction = "ASCENDING"
  }
  properties {
    name = "date"
    direction = "DESCENDING"
  }
}

resource "google_datastore_index" "Users1" {
  kind = "Users"
  properties {
    name = "msisdn"
    direction = "ASCENDING"
  }
  properties {
    name = "created"
    direction = "DESCENDING"
  }
}
