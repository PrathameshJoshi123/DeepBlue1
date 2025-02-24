from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import time
from typing import Optional, Tuple

geolocator = Nominatim(user_agent="geo_locator")

def get_coordinates(building_name: str, street_name: str, city: str, state: str) -> Optional[Tuple[float, float]]:
    """
    Fetches latitude and longitude using Geopy from the given address components.
    If the first attempt fails, tries different combinations of the address.

    :return: Tuple (longitude, latitude) or None if not found.
    """
    address_variations = [
        f"{building_name}, {city}, {state}",
        f"{building_name}, {street_name}, {city}, {state}",
        f"{street_name}, {city}, {state}",
    ]

    for address in address_variations:
        try:
            location = geolocator.geocode(address, timeout=10)
            if location:
                print(address)
                return (location.latitude, location.longitude)  # (lng, lat) format for GeoJSON
        except GeocoderTimedOut:
            time.sleep(1)  # Retry after a short delay

    return None  # If no coordinates found
