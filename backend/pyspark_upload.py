import requests
import os
import yaml
from pyspark.sql import SparkSession
from utils import us_state_to_abbrev
import datetime

"""
Pipeline for requesting data then 
uploading the data to a mongoDB database
"""

api_key = ""
api_file = "auth.yaml"
base_url = "http://api.weatherapi.com/v1/current.json"
db_passwd = ""
mongo_usr = ""


def get_data_from_city(city: str):
    """
    weather data from one part of the city
    just use REQUESTS and do a call
    
    """
    params={"key": api_key, "q": city}
    response = requests.get(base_url, params)
    print("here's the url: ", response.request.url)
    
    return response.json() if response.status_code == 200 else None

try:
    with(open(api_file, 'r') as f):
        config = yaml.safe_load(f)
        api_key = config['weather_data_api']
        mongo_usr = config['mongodb_user']
        db_passwd = config['mongodb_password']

except FileNotFoundError:
    print("'%s' file not found:" % filename)

USA_Major_Cities = {}
try:
    with(open('cities.yaml', 'r') as f):
        USA_Major_Cities = yaml.safe_load(f) 
except FileNotFoundError:
    raise RuntimeError("could not find cities.yaml")

usa_major_cities = USA_Major_Cities['USA_Major_Cities']

mongo_uri = f"mongodb+srv://{mongo_usr}:{db_passwd}@cluster0.g81bj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
spark = SparkSession \
    .builder \
    .appName("Spark SQL weather data transform")\
    .config("spark.mongodb.write.connection.uri", mongo_uri) \
    .config('spark.jars.packages', 'org.mongodb.spark:mongo-spark-connector_2.12:2.4.0')\
    .getOrCreate()



# uncomment this when you figure out spark

data = []
curr_time = datetime.datetime.now(datetime.timezone.utc).isoformat()
for state in usa_major_cities.keys():
    for city in usa_major_cities[state]:
        
        raw_data = get_data_from_city(city)
        temp_f = raw_data['current']['temp_f']
        wind_mph = raw_data['current']['wind_mph']
        humid = raw_data['current']['humidity']
        data.append({"city": city,  
                    "state": state,
                    "time": curr_time, 
                    "wind_speed": wind_mph, 
                    "temperature":temp_f,
                    "humidity": humid})

df = spark.createDataFrame(data)
df.show(df.count())

# Upload to database

df.write \
.format("com.mongodb.spark.sql.DefaultSource")\
.mode("overwrite")\
.option("uri", mongo_uri)\
.option("database", "weather_data")\
.option("collection", "weather")\
.save()