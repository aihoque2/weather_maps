import os
from elasticsearch import Elasticsearch

"""
script to set up database
"""

username = 'elastic'
password = os.getenv('ELASTIC_PASSWORD') # Value you set in the environment variable

client = Elasticsearch(
    "http://localhost:9200",
    basic_auth=(username, password)
)

idx_name = "weather_data"

mappings =  {
 "properties": {
    "city": {
        "type": "keyword"
    },
    "datetime": {
        "type": "date",
        "format": "yyyy-MM-dd'T'HH:mm:ss"  # ISO8601 format
    },
    "wind_speed": {
        "type": "float"
    },
    "temperature":{
        "type": "float"
    },
    "humidity":{
        "type": "float"
    }
 }   
}

if not client.indices.exists(index=idx_name):
    client.indices.create(index=idx_name, mappings=mappings)
else:
    print("index already exists")
