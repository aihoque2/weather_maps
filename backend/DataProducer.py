"""
DataProducer.py

collect the weather data from api requests and
publish the kafka topic

request from:
https://www.weatherapi.com/unverified.aspx?tagid=01202408235201010823

"""

import requests
from confluent_kafka import Producer
import yaml

class DataProducer:
    """
    TODO: turn this into an ABC?

    """
    def __init__(self):
        self.api_key = ''
        # best practices
        api_file = "auth.yaml"
        try:
            with(open(api_file, 'r') as f):
                config = yaml.safe_load(f)
                self.api_key = config['weather_data_api']
        except FileNotFoundError:
            print("'%s' file not found:" % filename)

        USA_Major_Cities = {}
        try:
            with(open('cities.yaml', 'r') as f):
                USA_Major_Cities = yaml.safe_load(f) 
        except FileNotFoundError:
            raise RuntimeError("could not find cities.yaml")
        
        self.states = USA_Major_Cities['USA_Major_Cities']
        print("here's self.states: ", self.states)


        self.base_url = "http://api.weatherapi.com/v1/current.json"

        self.config = {}
        self.topic = 'Temperature'
    

        producer_conf = {
            'bootstrap.servers': 'localhost:9092',
        }
        self.producer = Producer(producer_conf)   


    def get_data_from_city(self, city: str):
        """
        weather data from one part of the city
        just use REQUESTS and do a call
        
        """
        params={"key": self.api_key, "q": city}
        response = requests.get(self.base_url, params)
        print("here's the url: ", response.request.url)
        
        return response.json() if response.status_code == 200 else None
    
    def producer_cb(self, err, msg):
        if err is not None:
            print('Message delivery failed: {}'.format(err))
        else:
            print('Message delivered to {} [{}]'.format(msg.topic(), msg.partition()))


    def produce_current_data(self):
        """
        collect the weather json from
        requests API then process it to
        be published on a Kafka topic.
        """
        for state in self.states.keys():
            for city in self.states[state]:
                try:
                    data = self.get_data_from_city(city)
                    if data is not None:
                        to_pub = f'{city}:'+ str(data['current']['temp_f'])
                        print("here's to_pub: ", to_pub)
                        self.producer.produce(self.topic, value=to_pub, callback=self.producer_cb)
                        self.producer.flush()
                    else:
                        print("produce_current_data() variable 'data' recieved none from the request")
                    
                except Exception as e:
                    print(f"produce_current_data() failed: {e}")


if __name__ == "__main__":
    # TODO: unit test this
    test_producer = DataProducer()
    response = test_producer.get_data_from_city("Pittsburgh, PA")
    print("DataProducer.py response from get_data_from_city(): ", response)
    test_producer.produce_current_data()
