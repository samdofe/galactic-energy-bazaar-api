import json
import random
from datetime import datetime, timedelta
import os

# Traders and Planets Data
traders = [
    "TraderULT011", "TraderZAR022", "TraderDRA033", "TraderECL044", "TraderCRY055",
    "TraderAET066", "TraderNOV077", "TraderJOV088", "TraderHYP099", "TraderNEB1010",
    "TraderULT0111", "TraderZAR0212", "TraderDRA0313", "TraderECL0414", "TraderCRY0515",
    "TraderAET0616", "TraderNOV0717", "TraderJOV0818", "TraderHYP0919", "TraderNEB1020",
    "TraderULT0121", "TraderZAR0222", "TraderDRA0323", "TraderECL0424", "TraderCRY0525",
    "TraderAET0626", "TraderNOV0727", "samdofe"
]
planets = ["ULT01", "ZAR02", "DRA03", "CRY05", "ECL04", "AET06", "NOV07", "JOV08", "HYP09", "NEB10"]

# Trade Statuses
statuses = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"]

# Trade types
types = ["BUY", "SELL"]

# Function to generate a random date within the last 3 months
def random_date():
    today = datetime.now()
    days_ago = random.randint(1, 90)  # Random number of days within the past 3 months
    trade_date = today - timedelta(days=days_ago)
    return trade_date

# Function to generate trade ID
def generate_trade_id(date, sequence):
    return f"TRD-{date.strftime('%Y%m%d')}-{sequence:04d}"

# Generate 1,000 trades
trades = []
date_sequence_map = {}  # To keep track of sequence numbers for each date

for i in range(1, 1001):
    zeta_joules = random.randint(10, 5000)  # Random energy trade amount
    price_per_unit = round(random.uniform(1, 10), 2)  # Random price per unit
    total_price = round(zeta_joules * price_per_unit, 2)  # Total price calculation
    trade_date = random_date()  # Random trade date

    # Generate trade ID
    date_key = trade_date.strftime('%Y%m%d')
    if date_key not in date_sequence_map:
        date_sequence_map[date_key] = 1
    else:
        date_sequence_map[date_key] += 1
    trade_id = generate_trade_id(trade_date, date_sequence_map[date_key])

    trade = {
        "_id": f"64b7f3e1c45e88a73d1{i:04d}",
        "tradeId": trade_id,
        "planetId": random.choice(planets),
        "traderId": random.choice(traders),
        "type": random.choice(types),
        "status": random.choice(statuses),
        "tradeDate": trade_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "zetaJoules": zeta_joules,
        "pricePerUnit": price_per_unit,
        "totalPrice": total_price,
        "createdAt": trade_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "updatedAt": (trade_date + timedelta(hours=random.randint(1, 48))).strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    trades.append(trade)

# Sort trades by tradeDate
trades.sort(key=lambda x: x['tradeDate'])

# Define the output directory and file path
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../ddbb-backup")
os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists
file_path = os.path.join(output_dir, "trades_collection.json")

# Save trades to JSON file
with open(file_path, "w") as file:
    # Convert datetime objects to ISO format during serialization
    json.dump(trades, file, indent=4, default=str)

print(f"Trades data saved to {file_path}")

