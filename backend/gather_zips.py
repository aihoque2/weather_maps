import requests
import pandas as pd # no spark here bc pandas is enuf
import json
from io import BytesIO

# using USPS excel sheet for these values
zip_spreadsheet_url = "https://postalpro.usps.com/mnt/glusterfs/2026-05/ZIP_Locale_Detail.xls"

def gather_zips():
    print("downloading zip spreadsheet...")
    response = requests.get(zip_spreadsheet_url)
    
    print("reading excel...")
    df = pd.read_excel(BytesIO(response.content), engine="xlrd")
    
    # check columns first run
    print("columns:", df.columns.tolist())
    print(df.head(3))
    
    zip_by_state = {}
    for _, row in df.iterrows():
        state = str(row["PHYSICAL STATE"]).strip()
        zip_code = str(int(row["DELIVERY ZIPCODE"])).zfill(5)
        
        if not zip_code.isdigit() or len(zip_code) != 5:
            continue
        if state not in zip_by_state:
            zip_by_state[state] = []
        zip_by_state[state].append(zip_code)

    # deduplicate and sort
    for state in zip_by_state:
        zip_by_state[state] = sorted(list(set(zip_by_state[state])))

    with open("zip_codes.json", "w") as f:
        json.dump(zip_by_state, f, indent=2)

    print("done. total states:", len(zip_by_state))
    print("total zips:", sum(len(v) for v in zip_by_state.values()))
    print("unique PHYSICAL ZIP:", df['PHYSICAL ZIP'].nunique())
    print("unique DELIVERY ZIPCODE:", df['DELIVERY ZIPCODE'].nunique())

if __name__ == "__main__":
    gather_zips()