import json
import random
from datetime import datetime, timedelta
import os

# Traders and Planets Data
traders = [
    "TraderULT011", "TraderULT012", "TraderZAR021", "TraderZAR022", "TraderDRA031",
    "TraderDRA032", "TraderCRY051", "TraderCRY052", "TraderECL041", "TraderECL042",
    "TraderJOV081", "TraderJOV082", "TraderHYP091", "TraderHYP092", "TraderNEB102",
    "TraderNEB103", "TraderULT013", "TraderZAR023", "TraderDRA033", "TraderCRY053",
    "TraderECL043", "TraderJOV083", "TraderECL043", "TraderHYP093", "TraderNEB104",
    "TraderULT014", "TraderZAR024", "TraderDRA034"
]
planets = ["ULT01", "ZAR02", "DRA03", "CRY05", "ECL04", "AET06", "NOV07", "JOV08", "HYP09", "NEB10"]

# Trade Statuses
statuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"]

# Function to generate a random date within the last 3 months
def random_date():
    today = datetime.now()
    days_ago = random.randint(1, 90)  # Random number of days within the past 3 months
    trade_date = today - timedelta(days=days_ago)
    return trade_date

# Generate 1,000 trades
trades = []
for i in range(1, 1001):
    zeta_joules = random.randint(10, 5000)  # Random energy trade amount
    price_per_unit = round(random.uniform(10, 1000), 2)  # Random price per unit
    total_price = round(zeta_joules * price_per_unit, 2)  # Total price calculation
    trade_date = random_date()  # Random trade date

    trade = {
        "_id": f"64b7f3e1c45e88a73d1{i:04d}",
        "tradeId": f"TRD{i:04d}",
        "planetId": random.choice(planets),
        "traderId": random.choice(traders),
        "status": random.choice(statuses),
        "tradeDate": trade_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "zetaJoules": zeta_joules,
        "pricePerUnit": price_per_unit,
        "totalPrice": total_price,
        "createdAt": trade_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "updatedAt": (trade_date + timedelta(hours=random.randint(1, 48))).strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    trades.append(trade)

# Define the output directory and file path
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../ddbb-backup")
os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists
file_path = os.path.join(output_dir, "trades_collection.json")

# Save trades to JSON file
with open(file_path, "w") as file:
    json.dump(trades, file, indent=4)

print(f"Trades data saved to {file_path}")
