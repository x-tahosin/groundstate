import os
import time
from playwright.sync_api import sync_playwright

output_dir = r"c:\Users\xtaho\Desktop\Dev Engine\contests\solterra\screenshots\groundstate"
os.makedirs(output_dir, exist_ok=True)

routes = [
    {"name": "01_home", "path": "/"},
    {"name": "02_explore", "path": "/explore/"},
    {"name": "03_how_it_works", "path": "/how-it-works/"},
    {"name": "04_benefits", "path": "/benefits/"},
    {"name": "05_community", "path": "/community/"},
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    # Set viewport to 1280x820 matching reference proportions
    page = browser.new_page(viewport={"width": 1280, "height": 820})
    
    for r in routes:
        url = f"http://localhost:4500{r['path']}"
        print(f"Navigating to {url}...")
        page.goto(url, wait_until="networkidle")
        time.sleep(1)
        save_path = os.path.join(output_dir, f"{r['name']}.png")
        page.screenshot(path=save_path, full_page=False)
        print(f"Saved {save_path}")

    # Also capture interactive modal states:
    # 1. 3-minute sensory reset modal on benefits page
    page.goto("http://localhost:4500/benefits/", wait_until="networkidle")
    time.sleep(0.5)
    page.click("button:has-text('Start 3-Minute Reset')")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(output_dir, "06_sensory_reset_modal.png"))
    print("Saved 06_sensory_reset_modal.png")

    # 2. DigitalOcean AI Telemetry HUD
    page.goto("http://localhost:4500/", wait_until="networkidle")
    time.sleep(0.5)
    page.click("button[aria-label='DigitalOcean AI HUD']")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(output_dir, "07_digitalocean_ai_hud.png"))
    print("Saved 07_digitalocean_ai_hud.png")

    # 3. Pocket Mode OLED
    page.goto("http://localhost:4500/", wait_until="networkidle")
    time.sleep(0.5)
    page.click("button[aria-label='Pocket Mode']")
    time.sleep(0.5)
    page.screenshot(path=os.path.join(output_dir, "08_pocket_mode_oled.png"))
    print("Saved 08_pocket_mode_oled.png")

    browser.close()
    print("All captures completed successfully!")
