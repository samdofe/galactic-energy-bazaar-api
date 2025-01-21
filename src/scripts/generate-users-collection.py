import json

users_data = [
    {"_id": "64b7f3e1c45e88a73d123001", "userId": "AdminUlthar", "username": "AdminUlthar", "email": "admin.ulthar@galaxy.com",
     "password": "$2b$10$dM7sqIaLkIfpFZjQz6OvFudxGjcDkTq7nptH6bRG98CquImMVbfGe", "role": "admin", "planetId": "ULT01",
     "createdAt": "2025-01-10T08:00:00Z", "updatedAt": "2025-01-12T10:00:00Z"},
    {"_id": "64b7f3e1c45e88a73d123002", "userId": "AdminZarxis", "username": "AdminZarxis", "email": "admin.zarxis@galaxy.com",
     "password": "$2b$10$dM7sqIaLkIfpFZjQz6OvFudxGjcDkTq7nptH6bRG98CquImMVbfGe", "role": "admin", "planetId": "ZAR02",
     "createdAt": "2025-01-09T09:30:00Z", "updatedAt": "2025-01-11T14:45:00Z"},
    {"_id": "64b7f3e1c45e88a73d123003", "userId": "CouncilDraconis", "username": "CouncilDraconis", "email": "council.draconis@galaxy.com",
     "password": "$2b$10$uhBMAI/1NxPT5MmKFSbOdey/r3ZPlWGP7ql0OYz9A6OF24ZxA1VA6", "role": "council", "planetId": "DRA03",
     "createdAt": "2025-01-08T12:00:00Z", "updatedAt": "2025-01-12T09:00:00Z"},
]

planets = ["ULT01", "ZAR02", "DRA03", "CRY05", "ECL04", "JOV08", "HYP09", "NEB10"]
trader_password = "$2b$10$fRPJ9J9MPE9b6JZ6RyTEhOeJnHFkM/V.VFW4bNc1J4mZGeV04GdTK"

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

file_path = "users_collection.json"
with open(file_path, "w") as file:
    json.dump(users_data, file, indent=4)

print(f"User data saved to {file_path}")

