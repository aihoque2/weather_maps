import requests
import os
import yaml
from pyspark.sql import SparkSession
from utils import us_state_to_abbrev
import datetime
from tqdm import tqdm

"""
Pipeline for requesting weather data 
based on zip codes then uploading the data 
to a mongoDB database
"""

api_key = ""
api_file = "auth.yaml"
base_url = "http://api.weatherapi.com/v1/current.json"
db_passwd = ""
mongo_usr = ""

zip_spreadsheet_url = "https://postalpro.usps.com/mnt/glusterfs/2026-05/ZIP_Locale_Detail.xls"


def get_data_from_zip(zip: str):
    """
    weather data from one part of the city
    just use REQUESTS and do a call
    
    """
    params={"key": api_key, "q": zip}
    response = requests.get(base_url, params)
    
    return response.json() if response.status_code == 200 else None

try:
    with(open(api_file, 'r') as f):
        config = yaml.safe_load(f)
        api_key = config['weather_data_api']
        mongo_usr = config['mongodb_user']
        db_passwd = config['mongodb_password']

except FileNotFoundError:
    print("'%s' file not found:" % api_file)


mongo_uri = f"mongodb+srv://{mongo_usr}:{db_passwd}@cluster0.g81bj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

