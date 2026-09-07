import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = "/Users/Achal/Applications/My Apps"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 1080 x 1920 standard 9:16 Play Store screenshot dimensions
CANVAS_W = 1080
CANVAS_H = 1920

# System Fonts
FONT_BOLD_PATH = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG_PATH = "/System/Library/Fonts/Supplemental/Arial.ttf"

title_font = ImageFont.truetype(FONT_BOLD_PATH, 42)
sub_font = ImageFont.truetype(FONT_REG_PATH, 28)

MOCKUP_CONFIGS = [
  {
    "name": "playstore_mockup_1_panchang.png",
    "image_path": "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788594664702.png",
    "title": "Accurate Daily Panchangam & Timings",
    "subtitle": "Tithi, Nakshatra, Yoga, Karana, Sunrise & Sunset"
  },
  {
    "name": "playstore_mockup_2_jain_festivals.png",
    "image_path": "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788594705670.png",
    "title": "Hindu & Jain Festivals Directory",
    "subtitle": "Paryushan Parva, Samvatsari, Mahavir Jayanti & Vrat Dates"
  },
  {
    "name": "playstore_mockup_3_regional_languages_holidays.png",
    "image_path": "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788594723490.png",
    "title": "All Regional and International Languages & Holidays",
    "subtitle": "World Holidays, National Days & Multilingual Support"
  },
  {
    "name": "playstore_mockup_4_create_smart_reminders.png",
    "image_path": "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788594758430.png",
    "title": "Create Universal Smart Reminders",
    "subtitle": "Custom Fasting Alarms, Tithis & Progress Counters"
  },
  {
    "name": "playstore_mockup_5_settings_choghadiya_notifier.png",
    "image_path": "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788594770175.png",
    "title": "Settings - Choghadiya Notifier Available",
    "subtitle": "Universal Smart Reminders & Active Fasting Alerts"
  },
  {
    "name": "playstore_mockup_6_all_languages.png",
    "image_path": "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788595327842.png",
    "title": "All Regional & International Languages",
    "subtitle": "14+ Indian & Global Languages Supported"
  },
  {
    "name": "playstore_mockup_7_multiple_calendars.png",
    "image_path": "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788595433488.png",
    "title": "Support for All Religious & Solar Calendars",
    "subtitle": "Hindu, Jain, Sikh, Buddhist, Christian & Gregorian"
  },
  {
    "name": "playstore_mockup_8_monthly_calendar.png",
    "image_path": "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788595459065.png",
    "title": "Interactive Monthly Panchang Calendar",
    "subtitle": "Daily Tithis, Nakshatras, Fasting Days & Festivals"
  },
  {
    "name": "playstore_mockup_9_set_reminder_on_date.png",
    "image_path": "/Users/Achal/.gemini/antigravity/brain/78fbb997-6a55-436f-bc83-5841bfa31938/.user_uploaded/media_1788595486016.png",
    "title": "Set Smart Reminders Directly from Date",
    "subtitle": "One-Tap Alarms for Tithis, Fasting Days & Festivals"
  }
]

def draw_gradient_background(w, h):
    bg = Image.new("RGBA", (w, h), "#1A0006")
    draw = ImageDraw.Draw(bg)
    # Radial glow center
    glow = Image.new("RGBA", (w, h), (0,0,0,0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse([w//2 - 450, h//2 - 400, w//2 + 450, h//2 + 500], fill=(255, 111, 0, 40))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    bg = Image.alpha_composite(bg, glow)
    
    # Outer Decorative Gold Border
    d = ImageDraw.Draw(bg)
    d.rectangle([20, 20, w - 20, h - 20], outline="#D4AF37", width=3)
    d.rectangle([28, 28, w - 28, h - 28], outline="#800000", width=1)
    return bg

def create_device_mockup(config):
    bg = draw_gradient_background(CANVAS_W, CANVAS_H)
    draw = ImageDraw.Draw(bg)

    # 1. Text Overlay at top
    title_text = config["title"]
    sub_text = config["subtitle"]

    # Wrap title if too long
    if len(title_text) > 42:
        parts = title_text.split(" & ")
        if len(parts) == 2:
            title_text = parts[0] + " &\n" + parts[1]

    # Draw Title
    title_bbox = draw.multiline_textbbox((0, 0), title_text, font=title_font, align="center")
    title_w = title_bbox[2] - title_bbox[0]
    title_x = (CANVAS_W - title_w) // 2
    title_y = 60
    draw.text((title_x, title_y), title_text, font=title_font, fill="#FFE082", align="center")

    # Draw Subtitle
    sub_bbox = draw.multiline_textbbox((0, 0), sub_text, font=sub_font, align="center")
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_x = (CANVAS_W - sub_w) // 2
    sub_y = title_y + (title_bbox[3] - title_bbox[1]) + 15
    draw.text((sub_x, sub_y), sub_text, font=sub_font, fill="#FFF3E0", align="center")

    # 2. Device Frame Dimensions
    frame_x1 = 120
    frame_y1 = 280
    frame_x2 = CANVAS_W - 120
    frame_y2 = CANVAS_H - 60
    frame_w = frame_x2 - frame_x1
    frame_h = frame_y2 - frame_y1
    corner_radius = 42

    # Draw Phone Outer Bezel Shadow
    shadow = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0,0,0,0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle([frame_x1 - 10, frame_y1 - 10, frame_x2 + 10, frame_y2 + 10], radius=corner_radius + 8, fill=(0,0,0,180))
    shadow = shadow.filter(ImageFilter.GaussianBlur(25))
    bg = Image.alpha_composite(bg, shadow)
    draw = ImageDraw.Draw(bg)

    # Draw Outer Metallic Bezel
    draw.rounded_rectangle([frame_x1 - 6, frame_y1 - 6, frame_x2 + 6, frame_y2 + 6], radius=corner_radius + 4, fill="#1C1C1E", outline="#D4AF37", width=4)

    # Screen Inner Area
    screen_x1 = frame_x1 + 10
    screen_y1 = frame_y1 + 10
    screen_x2 = frame_x2 - 10
    screen_y2 = frame_y2 - 10
    screen_w = screen_x2 - screen_x1
    screen_h = screen_y2 - screen_y1

    # Load & Fit Screenshot
    if os.path.exists(config["image_path"]):
        src_img = Image.open(config["image_path"]).convert("RGBA")
        
        # Crop notch / titlebar off top of screenshot if present
        w_orig, h_orig = src_img.size
        # Trim top status bar if needed
        crop_top = int(h_orig * 0.04)
        src_img = src_img.crop((0, crop_top, w_orig, h_orig))
        
        # Resize to fit screen
        resized_img = src_img.resize((screen_w, screen_h), Image.LANCZOS)
        
        # Mask rounded corners for screen
        mask = Image.new("L", (screen_w, screen_h), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([0, 0, screen_w, screen_h], radius=corner_radius - 8, fill=255)
        
        bg.paste(resized_img, (screen_x1, screen_y1), mask)
    else:
        print(f"Warning: Screenshot file not found: {config['image_path']}")

    # Draw Phone Camera Punch Hole Notch
    punch_x = CANVAS_W // 2
    punch_y = screen_y1 + 24
    draw.ellipse([punch_x - 12, punch_y - 12, punch_x + 12, punch_y + 12], fill="#000000", outline="#333333", width=2)

    # Output File Path
    out_path = os.path.join(OUTPUT_DIR, config["name"])
    bg.convert("RGB").save(out_path, quality=95)
    print(f"✅ Generated Device Mockup: {out_path}")

print("🚀 Starting Phone Device Mockups Generation...")
for cfg in MOCKUP_CONFIGS:
    create_device_mockup(cfg)
print("🎉 All 5 Phone Device Mockups Generated Successfully!")
