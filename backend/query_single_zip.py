import requests
import yaml
import json
import datetime

"""
query_single_zip.py

take a single zip and
query it out to understand
how data is sent
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


zip_code = "63101"
try:
    params = {"key": api_key, "q": zip_code}
    response = requests.get("http://api.weatherapi.com/v1/current.json", params)
    if response.status_code != 200:
        print(
            f"FAILED {zip_code}: "
            f"HTTP {response.status_code} - {response.text}"
        )      

    data = response.json()

    print ("[query_single_zip.py] here's data:")
    print(data)
    print("[query_single_zip.py] here's lat:", data['location']['lat'])
    print("[query_single_zip.py] here's lon:", data['location']['lon'])
    

except Exception as e:
    print(f"failed for {zip_code}: {e}")
