import json
import sys
import urllib.request

def verify_insights():
    url = "http://127.0.0.1:8000/insights/weekly"
    print(f"Testing {url}...")
    try:
        with urllib.request.urlopen(url) as response:
            if response.status != 200:
                print(f"Error: Status code {response.status}")
                sys.exit(1)
            
            data = json.loads(response.read().decode())
            print("Response received:")
            print(data)
            
            # Verify structure
            required_keys = ["score", "pattern", "friction", "directive"]
            missing = [key for key in required_keys if key not in data]
            
            if missing:
                print(f"Validation Failed: Missing keys {missing}")
                sys.exit(1)
            
            if not isinstance(data["score"], (int, float)):
                print("Validation Failed: score is not a number")
                sys.exit(1)
                
            print("Validation Passed: JSON structure is correct.")

    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_insights()
