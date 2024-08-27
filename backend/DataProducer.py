"""
DataProducer.py

collect the weather data from api requests and
publish the kafka topic

request from:
https://www.weatherapi.com/unverified.aspx?tagid=01202408235201010823

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
        requests API then process it to
        be published on a Kafka topic.
        """
        pass

    def publish_data(self, data):
        """
        given the json format, publish the type of data
        """
        pass