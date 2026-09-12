import swisseph as swe
from datetime import datetime
import json

# PLANET_CAREER_DOMAINS & BNN Matrices from main.py
SIGN_ELEMENTS = {
    1: "Fire", 5: "Fire", 9: "Fire",
    2: "Earth", 6: "Earth", 10: "Earth",
    3: "Air", 7: "Air", 11: "Air",
    4: "Water", 8: "Water", 12: "Water"
}

PLANET_CAREER_DOMAINS = {
    "Surya": "Government Services, Civil Services (IAS/IPS), Administration, Executive CEO, Public Sector, Solar Energy.",
    "Chandra": "Hospitality, Logistics, Shipping, Food & Beverages, Liquids/Chemicals, Travel, Nursing, Psychology.",
    "Mangal": "Engineering (Mechanical/Civil/Robotics), Real Estate, Construction, Defense/Military, Police, Surgery.",
    "Budh": "Business, Accountancy, Software Development, Data Analytics, Journalism, Commerce, Trading.",
    "Guru": "Higher Education, Law/Judiciary, Financial Consulting, Executive Leadership, Strategy, Wealth Management.",
    "Shukra": "Luxury Goods, Media & Entertainment, Creative Design, Architecture, Finance, Fashion, Banking.",
    "Rahu": "Information Technology (IT), Artificial Intelligence (AI), Big Data, Foreign MNCs, Space Research, Aviation.",
    "Ketu": "Backend Software Coding, Cybersecurity, Data Recovery & Diagnostics, Scientific Research, Spiritual Healing & Alternative Medicine, Occult Sciences/Astrology, Niche Audit & Independent Advisory."
}

profiles = [
    {"name": "Profile 1: Achal Trivedi (User Benchmark)", "dob": "13/02/1989", "tob": "00:05", "city": "Surat", "lat": 21.17, "lon": 72.83},
    {"name": "Profile 2: Priya Sharma", "dob": "25/08/1995", "tob": "14:30", "city": "Delhi", "lat": 28.61, "lon": 77.21},
    {"name": "Profile 3: Vikram Patel", "dob": "05/11/1982", "tob": "08:15", "city": "Ahmedabad", "lat": 23.02, "lon": 72.57},
    {"name": "Profile 4: Rahul Verma", "dob": "18/04/2000", "tob": "21:45", "city": "Mumbai", "lat": 19.07, "lon": 72.87},
    {"name": "Profile 5: Ananya Roy", "dob": "30/12/1992", "tob": "06:10", "city": "Kolkata", "lat": 22.57, "lon": 88.36}
]

print("==================================================================================")
print("       5-PROFILE BNN SATURN CAREER ANALYSIS (SWISS EPHEMERIS ASTRO ENGINE)       ")
print("==================================================================================\n")

for p in profiles:
    dt = datetime.strptime(f"{p['dob']} {p['tob']}", "%d/%m/%Y %H:%M")
    utc = dt.hour + (dt.minute / 60.0) - 5.5
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    jd = swe.julday(dt.year, dt.month, dt.day, utc)

    _, ascmc = swe.houses_ex(jd, p["lat"], p["lon"], b'P', swe.FLG_SIDEREAL)
    asc_sign = int(ascmc[0] // 30) + 1

    planets_code = {
        "Surya": swe.SUN, "Chandra": swe.MOON, "Mangal": swe.MARS,
        "Budh": swe.MERCURY, "Guru": swe.JUPITER, "Shukra": swe.VENUS,
        "Shani": swe.SATURN, "Rahu": swe.MEAN_NODE
    }

    houses = {i: [] for i in range(1, 13)}
    longitudes = {}

    for name, code in planets_code.items():
        res, _ = swe.calc_ut(jd, code, swe.FLG_SIDEREAL)
        abs_long = res[0]
        longitudes[name] = abs_long
        h = ((int(abs_long // 30) + 1 - asc_sign) % 12) + 1
        houses[h].append(name)
        if name == "Rahu":
            ketu_long = (abs_long + 180.0) % 360.0
            longitudes["Ketu"] = ketu_long
            ketu_h = ((h + 6 - 1) % 12) + 1
            houses[ketu_h].append("Ketu")

    saturn_long = longitudes["Shani"]
    saturn_house = next(h for h, plist in houses.items() if "Shani" in plist)
    saturn_sign = ((saturn_house - 1 + asc_sign - 1) % 12) + 1
    saturn_element = SIGN_ELEMENTS.get(saturn_sign, "Air")
    saturn_deg = round(saturn_long % 30.0, 2)

    trine_planets = []
    all_forward_planets = []

    for p_name, p_long in longitudes.items():
        if p_name == "Shani": continue
        delta_long = (p_long - saturn_long) % 360.0
        p_house = next(h for h, plist in houses.items() if p_name in plist)
        rel_house = ((p_house - saturn_house) % 12) + 1
        p_sign = ((p_house - 1 + asc_sign - 1) % 12) + 1
        p_element = SIGN_ELEMENTS.get(p_sign, "Air")
        sign_deg = round(p_long % 30.0, 2)

        planet_info = {
            "planet": p_name,
            "sign_degree": sign_deg,
            "house": p_house,
            "rel_house_from_saturn": rel_house,
            "domain": PLANET_CAREER_DOMAINS.get(p_name, "")
        }
        all_forward_planets.append(planet_info)
        if rel_house in [1, 5, 9]:
            trine_planets.append(planet_info)

    trine_planets.sort(key=lambda x: x["sign_degree"])
    second_house_planets = [p for p in all_forward_planets if p["rel_house_from_saturn"] == 2]
    second_house_planets.sort(key=lambda x: x["sign_degree"])

    active_planet_names = set([p["planet"] for p in trine_planets] + [p["planet"] for p in second_house_planets])
    filtered_significations = [
        {"planet": p_name, "domain": PLANET_CAREER_DOMAINS[p_name]}
        for p_name in active_planet_names if p_name in PLANET_CAREER_DOMAINS
    ]

    print(f"----------------------------------------------------------------------------------")
    print(f"👤 {p['name']} | DOB: {p['dob']} {p['tob']} | {p['city']}")
    print(f"🌅 Ascendant Sign: {asc_sign} | 🪐 Saturn Base: House {saturn_house} ({saturn_element} Element, {saturn_deg}°)")
    print(f"📌 Identified Trine Planets (1, 5, 9 from Saturn):")
    for tp in trine_planets:
        print(f"   - {tp['planet']}: House {tp['house']} (Rel H{tp['rel_house_from_saturn']}) | Sign Deg: {tp['sign_degree']}°")

    print(f"⚡ Career Timeline (Sorted Ascending Degree Order):")
    for idx, tp in enumerate(trine_planets):
        print(f"   Phase {idx+1}: {tp['planet']} ({tp['sign_degree']}°) -> {tp['domain'][:60]}...")

    print(f"🏆 Destined Lifetime Career (2nd House Ahead):")
    if second_house_planets:
        h2_str = ", ".join([f"{hp['planet']} ({hp['sign_degree']}°)" for hp in second_house_planets])
        print(f"   Planets in 2nd House: {h2_str}")
        print(f"   Primary Destined Domain: {second_house_planets[0]['domain']}")
    else:
        print(f"   Planets in 2nd House: None (Independent Saturnine Karma)")

    print(f"🛑 Ketu Interception:")
    ketu_first = trine_planets and trine_planets[0]["planet"] == "Ketu"
    print(f"   Is Ketu Lowest Degree in Trine? {'YES (Age 18-24 Early Break & Research Shift)' if ketu_first else 'No'}")

    print(f"📚 Active Planet Significations Returned ({len(filtered_significations)}):")
    print(f"   " + ", ".join([f"{s['planet']}" for s in filtered_significations]))
    print()
