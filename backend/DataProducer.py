"""
DataProducer.py

collect the weather data from api requests and
publish the kafka topic

request from:
https://www.weatherapi.com/unverified.aspx?tagid=01202408235201010823

"""

import requests
from confluent_kafka import Proudcer
import yaml

ciites = ["Anchorage, AK", "Los Angeles, CA", "San Diego, CA", "San Francisco, CA", "Portland, OR" "Pittsburgh", "St. Louis"]
base_url = "http://api.weatherapi.com/v1

class DataProducer:
    """
    TODO: turn this into an ABC?

    """
    def __init__(self):
        self.api_key = ''
        # I don't want to expose the api key file
        api_file = "auth.yaml"
        try:
            with(open(api_file, 'r') as f):
                config = yaml.safe_load(f)
                self.api_key = config[weather_data_api]
        except FileNotFoundError:
            print("'%s' file not found:" % filename)


        self.config = {}
        self.topic = 'Temperatures'

        producer_conf = {'bootstrap.servers': 'localhost:9092'}
        self.producer = Producer(producer_conf)   
        weather_topic = ''


    def get_data_from_city(self, city):
        """
        weather data from one part of the city
        just use REQUESTS and do a call
        
        """
        params={"key": api_key, "q": city}
        response = request.get(base_url, params)
        return response.json() if response.status_code == 200 else None

    def get_current_data(self, cities):
        """
        collect the weather json from
        requests API then process it to
        be published on a Kafka topic.
        
        first guy to do
        """
        pass

    def producer_cb(self, err, msg):
        """
        producer callback f'n for when the
        topic is set up
        """
        pass

    def publish_data(self, data):
        """
        given the json format, publish the type of data
        """
        pass