import requests
import os
from pyspark.sql import SparkSession

spark = SparkSession \
    .builder \
    .appName("Spark SQL weather data transform")
    .config("spark.some.config.option", "some-value")
    .getOrCreate()