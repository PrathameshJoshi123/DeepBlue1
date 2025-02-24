from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

def get_lat_lon(address):
    geolocator = Nominatim(user_agent="geo_locator", timeout=10)  # Increased timeout
    try:
        location = geolocator.geocode(address, exactly_one=True)
        if location:
            return location.latitude, location.longitude
        else:
            return "Location not found"
    except GeocoderTimedOut:
        return "Timeout Error"

# Example Usage
address = "Seawoods Grand Central Mall, Seawoods"
coords = get_lat_lon(address)

print(coords)  # Output: (Latitude, Longitude) or "Location not found"
