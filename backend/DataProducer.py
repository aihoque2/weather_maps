"""
DataProducer.py

collect the weather data from api requests and
publish the kafka topic
"""

import requests
from confluent_kafka import Proudcer
import json

class DataProducer:
    def __init__(self):
        self.api_key = ''
        self.config = {}
        self.topic = ''

        self.producer = Producer()


    def get_current_data(self, cities):
        """
        collect the weather json from
        requests API then send it to
        the kafka topic
        """
        pass
