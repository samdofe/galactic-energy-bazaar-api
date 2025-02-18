import json
import os

# Original planets data
planets_data =[
  {
      "_id": "64b7f3e1c45e88a73d123abc",
      "planetId": "ULT01",
      "name": "Ulthar",
      "description": "A desert planet with high energy demands due to terraforming projects.",
      "language": "ULTH",
      "currency": "ULT_SHELLS",
      "tradeVolume": 7500000,
      "riskFactors": [
          "SOLAR_FLARE",
          "RESOURCE_SCARCITY"
      ],
      "images": {
        "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/ULT01.webp"
      },
      "color": "#a2b0bd",
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
      "language": "ZARX",
      "currency": "AQU_TOK",
      "tradeVolume": 12500000,
      "riskFactors": [
          "TIDAL_FLUCTUATION",
          "SEISMIC_ACTIVITY"
      ],
      "images": {
          "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/ZAR02.webp"
      },
      "color": "#e6993b",
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
      "language": "DRAC",
      "currency": "OBS_SHA",
      "tradeVolume": 13000000,
      "riskFactors": [
          "VOLCANIC_ERUPTION",
          "MINING_ACCIDENT"
      ],
      "images": {
          "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/DRA03.webp"
      },
      "color": "#d9bc8e",
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
      "language": "SOL",
      "currency": "PHOTON",
      "tradeVolume": 18000000,
      "riskFactors": [
          "SOLAR_STORM",
          "PIRACY"
      ],
      "images": {
          "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/ECL04.webp"
      },
      "color": "#d97557",
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
      "language": "CRYO",
      "currency": "FROST_CR",
      "tradeVolume": 8200000,
      "riskFactors": [
          "HARSH_WINTER",
          "GLACIAL_SHIFT"
      ],
      "images": {
          "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/CRY05.webp"
      },
      "color": "#a2b0bd",
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
      "language": "AETH",
      "currency": "SKY_TOK",
      "tradeVolume": 7200000,
      "riskFactors": [
          "ATMOS_INSTABILITY",
          "SUPPLY_DELAY"
      ],
      "images": {
          "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/AET06.webp"
      },
      "color": "#e9dec9",
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
      "language": "GALCOM",
      "currency": "NOVA_COIN",
      "tradeVolume": 9500000,
      "riskFactors": [
          "INFRA_UNSTABLE",
          "ECONOMIC_UNCERTAINTY"
      ],
      "images": {
          "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/NOV07_base.webp",
          "second": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/NOV07_second.webp",
          "third": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/NOV07_third.webp"
      },
      "color": "#5e90f1",
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
      "language": "JOV",
      "currency": "GAS_COIN",
      "tradeVolume": 15000000,
      "riskFactors": [
          "SUPPLY_DISRUPTION",
          "ORBIT_UNSTABLE"
      ],
      "images": {
          "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/JOV08.webp"
      },
      "color": "#625e5a",
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
      "language": "HYP",
      "currency": "NANO_CR",
      "tradeVolume": 11000000,
      "riskFactors": [
          "AI_MALFUNCTION",
          "CYBER_RISK"
      ],
      "images": {
          "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/HYP09.webp"
      },
      "color": "#97c5cf",
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
      "language": "NEB",
      "currency": "ENER_CRYST",
      "tradeVolume": 9700000,
      "riskFactors": [
          "IMPORT_DELAY",
          "PIRACY_THREAT"
      ],
      "images": {
          "base": "https://res.cloudinary.com/dd35qsdkl/image/upload/v1737976180/geb-images/NEB10.webp"
      },
      "color": "#5e90f1",
      "averageDailyConsumption": 410000,
      "creditRating": "A",
      "createdAt": "2025-01-08T18:00:00Z",
      "updatedAt": "2025-01-12T17:30:00Z"
  }
]

# Define the output directory and file path
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../ddbb-backup")
os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists
file_path = os.path.join(output_dir, "planets_collection.json")

# Save trades to JSON file
with open(file_path, "w") as file:
    json.dump(planets_data, file, indent=4)

print(f"Planets data saved to {file_path}")
