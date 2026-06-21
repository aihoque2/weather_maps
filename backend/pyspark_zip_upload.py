import requests
import yaml
import json
import datetime
from pyspark.sql import SparkSession
from tqdm import tqdm

"""
gather data from weatherAPI
using zip codes and upload
to mongoDB
"""


# initial API stuff
api_key = ""
api_file = "auth.yaml"
base_url = "http://api.weatherapi.com/v1/current.json"
db_passwd = ""
mongo_usr = ""
try:
    with(open(api_file, 'r') as f):
        config = yaml.safe_load(f)
        api_key = config['weather_data_api']
        mongo_usr = config['mongodb_user']
        db_passwd = config['mongodb_password']

except FileNotFoundError:
    print("'%s' file not found:" % api_file)

mongo_uri = f"mongodb+srv://{mongo_usr}:{db_passwd}@cluster0.g81bj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


# load zip codes
with open("zip_codes.json", "r") as f:
    zip_by_state = json.load(f)

# flatten to (zip, state) pairs
zip_state_pairs = [
    (zip_code, state)
    for state, zips in zip_by_state.items()
    for zip_code in zips
]

print(f"total zip/state pairs: {len(zip_state_pairs)}")

spark = SparkSession \
    .builder \
    .appName("Spark zip code weather ingest") \
    .config("spark.mongodb.write.connection.uri", mongo_uri) \
    .config('spark.jars.packages', 'org.mongodb.spark:mongo-spark-connector_2.12:2.4.0') \
    .getOrCreate()

sc = spark.sparkContext

# broadcast api_key so workers can access it
api_key_bc = sc.broadcast(api_key)

def fetch_weather(zip_state):

    zip_code, state = zip_state
    try:
        params = {"key": api_key_bc.value, "q": zip_code}
        response = requests.get("http://api.weatherapi.com/v1/current.json", params)
        if response.status_code != 200:
            return None
        data = response.json()
        return {
            "zip": zip_code,
            "state": state,
            "temperature": data["current"]["temp_f"],
            "humidity": data["current"]["humidity"],
            "wind_speed": data["current"]["wind_mph"],
            "time": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
    except Exception as e:
        print(f"failed for {zip_code}: {e}")
        return None

# parallelize and fetch
zips_rdd = sc.parallelize(zip_state_pairs, numSlices=60)
results_rdd = zips_rdd.map(fetch_weather).filter(lambda x: x is not None)

# convert to DataFrame and write to MongoDB
df = results_rdd.toDF()
df.show(5)

df.write \
    .format("com.mongodb.spark.sql.DefaultSource") \
    .mode("append") \
    .option("uri", mongo_uri) \
    .option("database", "weather_data") \
    .option("collection", "weather_zip") \
    .save()

print("zip code upload done.")