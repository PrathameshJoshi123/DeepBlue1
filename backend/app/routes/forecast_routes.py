from flask import Blueprint, request, jsonify
from app.config.database import db
from datetime import datetime, timedelta
import json
import os
import requests
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

forecast_bp = Blueprint("forecast", __name__)

# Eventbrite API configuration
EVENTBRITE_API_KEY = os.getenv("EVENTBRITE_API_KEY")
EVENTBRITE_PRIVATE_TOKEN = os.getenv("EVENTBRITE_PRIVATE_TOKEN")
EVENTBRITE_BASE_URL = "https://www.eventbriteapi.com/v3"

# Gemini API configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Helper function to fetch events from Eventbrite
def fetch_eventbrite_events(location="Mumbai", within_km=10, categories=None, start_date=None, end_date=None):
    """
    Fetch events from Eventbrite API based on location and other parameters
    """
    if not start_date:
        start_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    if not end_date:
        end_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%dT%H:%M:%S")
    
    headers = {
        "Authorization": f"Bearer {EVENTBRITE_PRIVATE_TOKEN}"
    }
    
    params = {
        "location.address": location,
        "location.within": f"{within_km}km",
        "start_date.range_start": start_date,
        "start_date.range_end": end_date,
    }
    
    if categories:
        params["categories"] = categories
    
    try:
        response = requests.get(
            f"{EVENTBRITE_BASE_URL}/events/search/",
            headers=headers,
            params=params
        )
        
        if response.status_code == 200:
            return response.json().get("events", [])
        else:
            print(f"Error fetching events: {response.status_code}, {response.text}")
            return []
    except Exception as e:
        print(f"Exception fetching events: {e}")
        return []

# Estimate food needs based on event attendance
def estimate_food_needs(attendance):
    """
    Estimate food needs in kg based on attendance
    Simple formula: 0.5kg per person
    """
    return attendance * 0.5

@forecast_bp.route("/events", methods=["GET"])
def forecast_events():
    """Get upcoming events and forecast food needs"""
    try:
        # Get query parameters
        location = request.args.get("location", "Mumbai")
        within_km = int(request.args.get("within_km", 10))
        days_ahead = int(request.args.get("days_ahead", 30))
        
        # Calculate date range
        start_date = datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
        end_date = (datetime.now() + timedelta(days=days_ahead)).strftime("%Y-%m-%dT%H:%M:%S")
        
        # Fetch events from Eventbrite
        eventbrite_events = fetch_eventbrite_events(
            location=location,
            within_km=within_km,
            start_date=start_date,
            end_date=end_date
        )
        
        # Process events and estimate food needs
        upcoming_events = []
        
        if eventbrite_events:
            for event in eventbrite_events:
                # Extract relevant information
                name = event.get("name", {}).get("text", "Unnamed Event")
                start = event.get("start", {})
                venue_id = event.get("venue_id")
                capacity = event.get("capacity", 100)  # Default to 100 if not specified
                
                # Format date
                event_date = start.get("local", "").split("T")[0] if start else None
                
                # Get venue details if available
                venue_name = "Unknown Venue"
                if venue_id:
                    try:
                        venue_response = requests.get(
                            f"{EVENTBRITE_BASE_URL}/venues/{venue_id}/",
                            headers={"Authorization": f"Bearer {EVENTBRITE_PRIVATE_TOKEN}"}
                        )
                        if venue_response.status_code == 200:
                            venue_data = venue_response.json()
                            venue_name = venue_data.get("name", "Unknown Venue")
                    except Exception as e:
                        print(f"Error fetching venue: {e}")
                
                # Estimate attendance (using capacity as a proxy)
                expected_attendance = capacity
                
                # Estimate food needs
                estimated_food = estimate_food_needs(expected_attendance)
                
                upcoming_events.append({
                    "name": name,
                    "date": event_date,
                    "location": venue_name,
                    "expected_attendance": expected_attendance,
                    "estimated_food_needed": estimated_food
                })
        
        # If no events found or API fails, provide some default events
        if not upcoming_events:
            upcoming_events = [
                {
                    "name": "Community Festival",
                    "date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
                    "location": "Central Park",
                    "expected_attendance": 500,
                    "estimated_food_needed": 250  # kg
                },
                {
                    "name": "Charity Fundraiser",
                    "date": (datetime.now() + timedelta(days=14)).strftime("%Y-%m-%d"),
                    "location": "City Hall",
                    "expected_attendance": 300,
                    "estimated_food_needed": 150  # kg
                },
                {
                    "name": "Food Drive",
                    "date": (datetime.now() + timedelta(days=21)).strftime("%Y-%m-%d"),
                    "location": "Community Center",
                    "expected_attendance": 200,
                    "estimated_food_needed": 100  # kg
                }
            ]
        
        return jsonify({"events": upcoming_events}), 200
    
    except Exception as e:
        print(f"Error in forecast_events: {e}")
        return jsonify({"error": str(e)}), 500

@forecast_bp.route("/optimize", methods=["POST"])
def optimize_distribution():
    """Optimize food distribution based on available supplies and demands"""
    try:
        data = request.json
        available_food = data.get("available_food", 0)
        
        # Get current food demands (from receivers)
        # In a real implementation, you would fetch this from your database
        # For now, we'll use mock data
        receivers = [
            {"id": "1", "name": "Food Bank A", "location": "North District", "demand": 100},
            {"id": "2", "name": "Shelter B", "location": "South District", "demand": 150},
            {"id": "3", "name": "Community Center C", "location": "East District", "demand": 80}
        ]
        
        # Simple optimization algorithm (proportional distribution)
        total_demand = sum(r["demand"] for r in receivers)
        
        # Calculate optimized distribution
        optimized_distribution = []
        remaining_food = available_food
        
        for receiver in receivers:
            # Allocate proportionally to demand
            if total_demand > 0:
                allocation = min(receiver["demand"], int(available_food * (receiver["demand"] / total_demand)))
                remaining_food -= allocation
            else:
                allocation = 0
                
            optimized_distribution.append({
                "receiver_id": receiver["id"],
                "receiver_name": receiver["name"],
                "location": receiver["location"],
                "allocated_amount": allocation,
                "demand_fulfilled": f"{int(allocation / receiver['demand'] * 100)}%" if receiver["demand"] > 0 else "0%"
            })
        
        return jsonify({
            "optimized_distribution": optimized_distribution,
            "total_allocated": available_food - remaining_food,
            "remaining_unallocated": remaining_food
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@forecast_bp.route("/analyze-consumption", methods=["POST"])
def analyze_consumption_patterns():
    """Analyze food consumption patterns and generate insights using Gemini API"""
    try:
        data = request.json
        consumption_data = data.get("consumption_data", [])
        location = data.get("location", "Mumbai")
        time_period = data.get("time_period", "last 3 months")
        
        # If no Gemini API key is provided, return mock insights
        if not GEMINI_API_KEY:
            return jsonify({
                "insights": [
                    {
                        "title": "Seasonal Variations",
                        "description": "Food consumption increases by 30% during festival seasons.",
                        "recommendation": "Plan for increased food collection 2 weeks before major festivals."
                    },
                    {
                        "title": "Geographic Patterns",
                        "description": "Northern districts show 25% higher demand for vegetarian food options.",
                        "recommendation": "Allocate more vegetarian food resources to northern district food banks."
                    },
                    {
                        "title": "Waste Reduction",
                        "description": "Perishable items account for 40% of food waste.",
                        "recommendation": "Prioritize quick distribution of perishable items within 24 hours of collection."
                    },
                    {
                        "title": "Demographic Insights",
                        "description": "Families with children require 35% more food resources than single individuals.",
                        "recommendation": "Create family-sized food packages for more efficient distribution."
                    }
                ],
                "summary": "Food consumption patterns show significant variations based on season, location, and demographics. Implementing targeted distribution strategies can improve efficiency by approximately 40%."
            }), 200
        
        # Prepare data for Gemini API
        prompt = f"""
        Analyze the following food consumption data for {location} over {time_period} and provide actionable insights:
        
        {json.dumps(consumption_data, indent=2)}
        
        Please provide:
        1. 4-5 key insights about consumption patterns
        2. Specific recommendations for each insight
        3. A brief summary of overall findings
        
        Format the response as a JSON with the following structure:
        {{
            "insights": [
                {{
                    "title": "Insight Title",
                    "description": "Description of the pattern identified",
                    "recommendation": "Actionable recommendation"
                }}
            ],
            "summary": "Overall summary of findings"
        }}
        """
        
        # Call Gemini API
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)
        
        # Parse the response
        try:
            # Try to extract JSON from the response
            response_text = response.text
            # Find JSON content between triple backticks if present
            if "```json" in response_text and "```" in response_text.split("```json")[1]:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text and "```" in response_text.split("```")[1]:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text
                
            analysis_result = json.loads(json_str)
            return jsonify(analysis_result), 200
        except Exception as e:
            print(f"Error parsing Gemini response: {e}")
            # Return the raw response if parsing fails
            return jsonify({
                "insights": [
                    {
                        "title": "AI Analysis",
                        "description": response.text,
                        "recommendation": "Please review the analysis and form your own recommendations."
                    }
                ],
                "summary": "Analysis completed with raw results."
            }), 200
        
    except Exception as e:
        print(f"Error in analyze_consumption_patterns: {e}")
        return jsonify({"error": str(e)}), 500 