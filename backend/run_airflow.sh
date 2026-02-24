#!/bin/bash

# symlink so edits to the repo file are reflected immediately
ln -sf ~/Projects/data-projects/weather_maps/airflow/weather_dag.py ~/airflow/dags/weather_dag.py

airflow standalone  # spins up scheduler + webserver in one command
