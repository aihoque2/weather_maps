from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

default_args = {
    'owner': 'ammar',
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

with DAG(
    dag_id='weather_pipeline',
    default_args=default_args,
    description='run pyspark weather ingestion hourly',
    schedule_interval='@hourly',
    start_date=datetime(2026, 1, 1),
    catchup=False,  # don't backfill missed runs
) as dag:

    run_pyspark = BashOperator(
        task_id='run_pyspark_upload',
        # this is our scheduler to run
        bash_command='cd ~/Projects/data-projects/weather_maps/backend && python pyspark_upload.py',
    )

    run_pyspark