import urllib.request
import json

profiles = [
    {
        "name": "Profile 1: Achal Trivedi (Benchmark)",
        "dob": "13/02/1989",
        "tob": "00:05",
        "city": "Surat",
        "lat": 21.17,
        "lon": 72.83
    },
    {
        "name": "Profile 2: Priya Sharma",
        "dob": "25/08/1995",
        "tob": "14:30",
        "city": "Delhi",
        "lat": 28.61,
        "lon": 77.21
    },
    {
        "name": "Profile 3: Vikram Patel",
        "dob": "05/11/1982",
        "tob": "08:15",
        "city": "Ahmedabad",
        "lat": 23.02,
        "lon": 72.57
    },
    {
        "name": "Profile 4: Rahul Verma",
        "dob": "18/04/2000",
        "tob": "21:45",
        "city": "Mumbai",
        "lat": 19.07,
        "lon": 72.87
    },
    {
        "name": "Profile 5: Ananya Roy",
        "dob": "30/12/1992",
        "tob": "06:10",
        "city": "Kolkata",
        "lat": 22.57,
        "lon": 88.36
    }
]

url = "https://lalkitab-engine.onrender.com/analyze"

print("==================================================================================")
print("              TESTING LIVE BNN CAREER ENGINE API ON 5 PROFILES                  ")
print("==================================================================================\n")

for p in profiles:
    print(f"\n----------------------------------------------------------------------------------")
    print(f"👤 {p['name']} | DOB: {p['dob']} | TOB: {p['tob']} | City: {p['city']}")
    payload = {
        "dob": p["dob"],
        "tob": p["tob"],
        "city": p["city"],
        "lat": p["lat"],
        "lon": p["lon"],
        "lang": "en"
    }
    
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            sat_nadi = data.get("saturn_nadi_career_analysis", {})
            bnn_tl = data.get("bnn_timeline", {})

            print(f"🌅 Ascendant Sign: {data.get('ascendant_sign')}")
            print(f"🪐 Saturn Placement: House {sat_nadi.get('saturn_house')} (Sign Element: {sat_nadi.get('saturn_element')}, Longitude: {sat_nadi.get('saturn_longitude')}°, Sign Deg: {sat_nadi.get('saturn_sign_degree')}°)")
            
            print(f"\n📌 Trine Planets Identified (1, 5, 9 from Saturn):")
            for tp in sat_nadi.get("trine_planets", []):
                print(f"   - {tp.get('planet')}: House {tp.get('house')} (Rel H: {tp.get('rel_house_from_saturn')}) | Sign Deg: {tp.get('sign_degree')}° | Domain: {tp.get('domain')}")
            
            print(f"\n⚡ Chronological Phases (Sorted Ascending Degree Order):")
            for ph in sat_nadi.get("chronological_phases", []):
                print(f"   - {ph}")

            print(f"\n🏆 Destined Lifetime Career (2nd House Ahead):")
            print(f"   {sat_nadi.get('destination_career')}")

            print(f"\n🎯 Most Likely Subdomain:")
            print(f"   {sat_nadi.get('most_likely_subdomain')}")

            print(f"\n🔮 Multi-Planet Niche:")
            print(f"   {sat_nadi.get('combination_niche')}")

            print(f"\n🛑 Ketu Interception Details:")
            print(f"   {sat_nadi.get('ketu_interception_break')}")

            print(f"\n📚 Active Planetary Significations Returned ({len(sat_nadi.get('planet_significations', []))}):")
            for sig in sat_nadi.get("planet_significations", []):
                print(f"   - {sig.get('planet')}: {sig.get('domain')}")

    except Exception as e:
        print(f"❌ Error testing profile {p['name']}: {e}")

print("\n==================================================================================")
