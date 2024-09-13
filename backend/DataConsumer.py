"""
DataConsumer.py
take the data from the kafka topic stream

store it in some database or some backend accessible
via some visualization API embedded by React.

storing data in elasticsearch:
https://kitwaicloud.github.io/elk/weather.html

"""

class DataConsumer:
    """
    subscribe to a data topic and collect the 
    data and upload it to an ElasticSearch database
    """
    def __init__(self):
        pass