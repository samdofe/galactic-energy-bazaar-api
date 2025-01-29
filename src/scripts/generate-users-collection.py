import json
import os
import random
from cloudinary.uploader import upload
import cloudinary
from dotenv import load_dotenv

# Load environment variables from .env.development file
load_dotenv('.env.development')

# Configure Cloudinary using environment variables
cloudinary.config(
  cloud_name = os.getenv('CLOUDINARY_CLOUD_NAME'),
  api_key = os.getenv('CLOUDINARY_API_KEY'),
  api_secret = os.getenv('CLOUDINARY_API_SECRET')
)

admin_password = "$2a$10$d3BHlhP/iPxGnpK.8INPZOBaDcqMOkjtVStwPUcGQ0Pwsjhi0lTM2"
council_password = "$2a$10$SbDx0y5oOAFbOGwTjJ6tH.wApF.I6j2mdUYu8KPdv/dKrokzvQHE2"
trader_password = "$2a$10$ae4B/gRMOEg8aUJo9seXbePcZcrbNNiilcoq0XtoFDSuMCV/L2buC"

planets = ["ULT01", "ZAR02", "DRA03", "ECL04", "CRY05", "AET06", "NOV07", "JOV08", "HYP09", "NEB10"]

# Get list of image files
image_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../public/WebP_T")
image_files = [f for f in os.listdir(image_dir) if f.endswith('.webp')]

users_data = []

def create_user(role, planet_index, user_index):
    # Select a random image and get the username from the filename
    image_file = random.choice(image_files)
    username = os.path.splitext(image_file)[0]

    # Generate userId
    if role == 'admin':
        userId = f"Admin{planets[planet_index]}"
    elif role == 'council':
        userId = f"Council{planets[planet_index]}"
    else:
        userId = f"Trader{planets[planet_index]}{user_index}"

    # Generate unique email
    email = f"{role.lower()}{user_index}.{planets[planet_index].lower()}@galaxy.com"

    # Upload image to Cloudinary
    image_path = os.path.join(image_dir, image_file)
    upload_result = upload(image_path,
                           folder="geb-images",
                           public_id=userId,
                           overwrite=True)
    image_url = upload_result['secure_url']

    user = {
        "_id": f"64b7f3e1c45e88a73d123{len(users_data) + 1:03d}",
        "userId": userId,
        "username": username,
        "email": email,
        "password": admin_password if role == 'admin' else (council_password if role == 'council' else trader_password),
        "role": role,
        "planetId": planets[planet_index],
        "images": {
            "base": image_url
        },
        "createdAt": f"2025-01-{10 + len(users_data):02d}T08:00:00Z",
        "updatedAt": f"2025-01-{12 + len(users_data):02d}T10:00:00Z",
    }
    users_data.append(user)

    # Remove the used image from the list
    image_files.remove(image_file)

# Create 2 admins
create_user('admin', 0, 1)
create_user('admin', 1, 2)

# Create 1 council
create_user('council', 2, 1)

# Create traders
for i in range(27):
    planet_index = i % len(planets)
    create_user('trader', planet_index, i + 1)

# Define the output directory and file path
output_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../ddbb-backup")
os.makedirs(output_dir, exist_ok=True)  # Ensure the directory exists
file_path = os.path.join(output_dir, "users_collection.json")

with open(file_path, "w") as file:
    json.dump(users_data, file, indent=4)

print(f"User data saved to {file_path}")

