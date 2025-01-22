import json
import os

users_data = [
    {"_id": "64b7f3e1c45e88a73d123001", "userId": "AdminUlthar", "username": "AdminUlthar", "email": "admin.ulthar@galaxy.com",
     "password": "$2a$10$d3BHlhP/iPxGnpK.8INPZOBaDcqMOkjtVStwPUcGQ0Pwsjhi0lTM2", "role": "admin", "planetId": "ULT01",
     "createdAt": "2025-01-10T08:00:00Z", "updatedAt": "2025-01-12T10:00:00Z"},
    {"_id": "64b7f3e1c45e88a73d123002", "userId": "AdminZarxis", "username": "AdminZarxis", "email": "admin.zarxis@galaxy.com",
     "password": "$2a$10$d3BHlhP/iPxGnpK.8INPZOBaDcqMOkjtVStwPUcGQ0Pwsjhi0lTM2", "role": "admin", "planetId": "ZAR02",
     "createdAt": "2025-01-09T09:30:00Z", "updatedAt": "2025-01-11T14:45:00Z"},
    {"_id": "64b7f3e1c45e88a73d123003", "userId": "CouncilDraconis", "username": "CouncilDraconis", "email": "council.draconis@galaxy.com",
     "password": "$2a$10$SbDx0y5oOAFbOGwTjJ6tH.wApF.I6j2mdUYu8KPdv/dKrokzvQHE2", "role": "council", "planetId": "DRA03",
     "createdAt": "2025-01-08T12:00:00Z", "updatedAt": "2025-01-12T09:00:00Z"},
]

planets = ["ULT01", "ZAR02", "DRA03", "ECL04", "CRY05", "AET06", "NOV07", "JOV08", "HYP09", "NEB10"]
trader_password = "$2a$10$ae4B/gRMOEg8aUJo9seXbePcZcrbNNiilcoq0XtoFDSuMCV/L2buC"

for i in range(4, 31):
    planet_index = (i - 4) % len(planets)
    user = {
        "_id": f"64b7f3e1c45e88a73d123{i:03d}",
        "userId": f"Trader{planets[planet_index]}{(i - 3) // len(planets) + 1}",
        "username": f"Trader{planets[planet_index]}{(i - 3) // len(planets) + 1}",
        "email": f"trader{i - 3}.{planets[planet_index].lower()}@galaxy.com",
        "password": trader_password,
        "role": "trader",
        "planetId": planets[planet_index],
        "createdAt": f"2025-01-{10 + (i - 4) // len(planets):02d}T08:00:00Z",
        "updatedAt": f"2025-01-{12 + (i - 4) // len(planets):02d}T10:00:00Z",
    }
    users_data.append(user)

# Define the output directory and file path
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../ddbb-backup")
os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists
file_path = os.path.join(output_dir, "users_collection.json")

with open(file_path, "w") as file:
    json.dump(users_data, file, indent=4)

print(f"User data saved to {file_path}")

