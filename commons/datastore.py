from typing import Optional, List

from google.cloud import datastore
from google.cloud.datastore import Entity

REGISTRATIONS = "Registrations"
USERS = "Users"
ENCOUNTER_UPLOADS = "Encounter Uploads"

datastore_client = datastore.Client()


class QueryFilter:
    def __init__(self, property_name, operator, value):
        self.property_name = property_name
        self.operator = operator
        self.value = value


def get_entity_by_key(kind: str, _id: str) -> Optional[Entity]:
    key = datastore_client.key(kind, f"{_id}")
    return datastore_client.get(key=key)


def update_entity(entity: Entity, data: dict):
    entity.update(data)
    datastore_client.put(entity)


def find_entities_by_filter(kind: str, filters: List[QueryFilter], order: List = None) -> List[Entity]:
    query = datastore_client.query(kind=kind)
    for _filter in filters:
        query.add_filter(_filter.property_name, _filter.operator, _filter.value)
    if order:
        query.order = ["-date"]
    return list(query.fetch())


def create_entity(kind: str, key: str, data=None) -> None:
    _key = datastore_client.key(kind, key)

    entity = datastore.Entity(key=_key)
    if data:
        entity.update(data)
    datastore_client.put(entity)
