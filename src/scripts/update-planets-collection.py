import json
import os

# Original planets data
planets_data = [
     {
       "_id": "64b7f3e1c45e88a73d123abc",
       "planetId": "ULT01",
       "name": "Ulthar",
       "description": "A desert planet with high energy demands due to terraforming projects.",
       "language": { "label": "Ultharian", "key": "ULTH" },
       "currency": { "label": "Ultharian Shells", "key": "ULT_SHELLS" },
       "tradeVolume": 7500000,
       "riskFactors": [
         { "label": "Solar flares", "key": "SOLAR_FLARE" },
         { "label": "Resource scarcity", "key": "RESOURCE_SCARCITY" }
       ],
       "averageDailyConsumption": 300000,
       "creditRating": "AAA",
       "createdAt": "2025-01-10T08:30:00Z",
       "updatedAt": "2025-01-12T10:00:00Z"
     },
     {
       "_id": "64b7f3e1c45e88a73d123def",
       "planetId": "ZAR02",
       "name": "Zarxis Prime",
       "description": "An aquatic planet where most energy is used for underwater civilizations.",
       "language": { "label": "Zarxian", "key": "ZARX" },
       "currency": { "label": "Aquatic Tokens", "key": "AQU_TOK" },
       "tradeVolume": 12500000,
       "riskFactors": [
         { "label": "High tidal fluctuations", "key": "TIDAL_FLUCTUATION" },
         { "label": "Underwater seismic activity", "key": "SEISMIC_ACTIVITY" }
       ],
       "averageDailyConsumption": 450000,
       "creditRating": "A",
       "createdAt": "2025-01-09T15:00:00Z",
       "updatedAt": "2025-01-11T09:45:00Z"
     },
     {
       "_id": "64b7f3e1c45e88a73d124001",
       "planetId": "DRA03",
       "name": "Draconis",
       "description": "A volcanic world exporting rare minerals and using energy for mining operations.",
       "language": { "label": "Draconic", "key": "DRAC" },
       "currency": { "label": "Obsidian Shards", "key": "OBS_SHA" },
       "tradeVolume": 13000000,
       "riskFactors": [
         { "label": "Frequent eruptions", "key": "VOLCANIC_ERUPTION" },
         { "label": "Mining accidents", "key": "MINING_ACCIDENT" }
       ],
       "averageDailyConsumption": 380000,
       "creditRating": "A",
       "createdAt": "2025-01-01T11:00:00Z",
       "updatedAt": "2025-01-07T13:00:00Z"
     },
     {
       "_id": "64b7f3e1c45e88a73d124045",
       "planetId": "ECL04",
       "name": "Ecliptica",
       "description": "A planet with advanced solar farms that exports massive energy surpluses.",
       "language": { "label": "Solarian", "key": "SOL" },
       "currency": { "label": "Photon Units", "key": "PHOTON" },
       "tradeVolume": 18000000,
       "riskFactors": [
         { "label": "Solar storms", "key": "SOLAR_STORM" },
         { "label": "Piracy", "key": "PIRACY" }
       ],
       "averageDailyConsumption": 150000,
       "creditRating": "AAA",
       "createdAt": "2025-01-03T14:00:00Z",
       "updatedAt": "2025-01-09T18:00:00Z"
     },
     {
       "_id": "64b7f3e1c45e88a73d124067",
       "planetId": "CRY05",
       "name": "Cryonix",
       "description": "An icy world with high energy demands for heating and survival systems.",
       "language": { "label": "Cryonese", "key": "CRYO" },
       "currency": { "label": "Frost Credits", "key": "FROST_CR" },
       "tradeVolume": 8200000,
       "riskFactors": [
         { "label": "Harsh winters", "key": "HARSH_WINTER" },
         { "label": "Glacial shifts", "key": "GLACIAL_SHIFT" }
       ],
       "averageDailyConsumption": 320000,
       "creditRating": "AA",
       "createdAt": "2025-01-05T12:00:00Z",
       "updatedAt": "2025-01-11T08:00:00Z"
     },
     {
       "_id": "64b7f3e1c45e88a73d124089",
       "planetId": "AET06",
       "name": "Aetheria",
       "description": "A floating city-planet relying heavily on imported energy for air stabilization.",
       "language": { "label": "Aetherian", "key": "AETH" },
       "currency": { "label": "Sky Tokens", "key": "SKY_TOK" },
       "tradeVolume": 7200000,
       "riskFactors": [
         { "label": "Atmospheric instability", "key": "ATMOS_INSTABILITY" },
         { "label": "Supply chain delays", "key": "SUPPLY_DELAY" }
       ],
       "averageDailyConsumption": 280000,
       "creditRating": "BBB",
       "createdAt": "2025-01-02T09:00:00Z",
       "updatedAt": "2025-01-08T15:30:00Z"
     },
     {
       "_id": "64b7f3e1c45e88a73d1240ab",
       "planetId": "NOV07",
       "name": "Nova Terra",
       "description": "A recently colonized planet with booming energy needs for infrastructure.",
       "language": { "label": "Galactic Common", "key": "GALCOM" },
       "currency": { "label": "Nova Coins", "key": "NOVA_COIN" },
       "tradeVolume": 9500000,
       "riskFactors": [
         { "label": "Unstable infrastructure", "key": "INFRA_UNSTABLE" },
         { "label": "Economic uncertainty", "key": "ECONOMIC_UNCERTAINTY" }
       ],
       "averageDailyConsumption": 410000,
       "creditRating": "A",
       "createdAt": "2025-01-04T10:30:00Z",
       "updatedAt": "2025-01-10T14:45:00Z"
     },
     {
       "_id": "64b7f3e1c45e88a73d1240cd",
       "planetId": "JOV08",
       "name": "Jovaris",
       "description": "A gas giant with a booming energy export industry.",
       "language": { "label": "Jovarian", "key": "JOV" },
       "currency": { "label": "Gas Coins", "key": "GAS_COIN" },
       "tradeVolume": 15000000,
       "riskFactors": [
         { "label": "Supply chain disruptions", "key": "SUPPLY_DISRUPTION" },
         { "label": "Orbital instability", "key": "ORBIT_UNSTABLE" }
       ],
       "averageDailyConsumption": 200000,
       "creditRating": "AAA",
       "createdAt": "2025-01-06T14:00:00Z",
       "updatedAt": "2025-01-12T08:15:00Z"
     },
     {
       "_id": "64b7f3e1c45e88a73d1240ef",
       "planetId": "HYP09",
       "name": "Hyperion",
       "description": "A planet with advanced AI-driven energy systems and complex infrastructure.",
       "language": { "label": "Hyperian", "key": "HYP" },
       "currency": { "label": "Nano Credits", "key": "NANO_CR" },
       "tradeVolume": 11000000,
       "riskFactors": [
         { "label": "AI malfunctions", "key": "AI_MALFUNCTION" },
         { "label": "Cybersecurity risks", "key": "CYBER_RISK" }
       ],
       "averageDailyConsumption": 370000,
       "creditRating": "AA",
       "createdAt": "2025-01-07T16:00:00Z",
       "updatedAt": "2025-01-12T14:00:00Z"
     },
     {
       "_id": "64b7f3e1c45e88a73d124111",
       "planetId": "NEB10",
       "name": "Nebulon",
       "description": "A distant planet heavily reliant on intergalactic energy imports.",
       "language": { "label": "Nebulonian", "key": "NEB" },
       "currency": { "label": "Energy Crystals", "key": "ENER_CRYST" },
       "tradeVolume": 9700000,
       "riskFactors": [
         { "label": "Import delays", "key": "IMPORT_DELAY" },
         { "label": "Piracy threats", "key": "PIRACY_THREAT" }
       ],
       "averageDailyConsumption": 410000,
       "creditRating": "A",
       "createdAt": "2025-01-08T18:00:00Z",
       "updatedAt": "2025-01-12T17:30:00Z"
     }
]


# Transform the schema
for planet in planets_data:
    planet["language"] = planet["language"]["key"]
    planet["currency"] = planet["currency"]["key"]
    planet["riskFactors"] = [risk["key"] for risk in planet["riskFactors"]]

# Define the output directory and file path
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../ddbb-backup")
os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists
file_path = os.path.join(output_dir, "planets_collection.json")

# Save trades to JSON file
with open(file_path, "w") as file:
    json.dump(planets_data, file, indent=4)

print(f"Planets data saved to {file_path}")
