import yaml
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

db_passwd = ""
mongo_usr = ""

try:
    with(open('auth.yaml', 'r') as f):
        config = yaml.safe_load(f)
        api_key = config['weather_data_api']
        mongo_usr = config['mongodb_user']
        db_passwd = config['mongodb_password']

except FileNotFoundError:
    print("'%s' file not found:" % filename)


uri = f"mongodb+srv://ahoque245:{db_passwd}@cluster0.g81bj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
