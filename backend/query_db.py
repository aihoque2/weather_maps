import os
from elasticsearch import Elasticsearch
from utils import us_state_to_abbrev

print(us_state_to_abbrev["Pennsylvania"])

username = 'elastic'
password = os.getenv('ELASTIC_PASSWORD') # Value you set in the environment variable

client = Elasticsearch(
    "http://localhost:9200",
    basic_auth=(username, password)
)

response = client.search(index="my_index", query={
    "match": {
        "foo": "foo"
    }
})

print(response['hits']['hits'])