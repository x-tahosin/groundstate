import asyncio
import os
import sys
from playwright.async_api import async_playwright

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = "http://localhost:4173"
SCREENSHOT_DIR = r"c:\Users\xtaho\Desktop\Dev Engine\contests\solterra\screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

async def run_e2e():
    console_errors = []
    page_errors = []

    print("--- Starting SolTerra End-to-End Playwright Verification Suite ---")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # 1. Desktop Test Environment
        context = await browser.new_context(
            viewport={'width': 1440, 'height': 900},
            device_scale_factor=1.25
        )
        page = await context.new_page()

        # Listen for console logs and errors
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error", "warning"] else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        print(f"1. Navigating to {BASE_URL}...")
        response = await page.goto(BASE_URL, wait_until="networkidle")
        assert response.status == 200, f"Expected 200, got {response.status}"
        await page.wait_for_timeout(1000)

        # Check Page Title & Headings
        title = await page.title()
        print(f"   Page Title: '{title}'")
        assert "SolTerra" in title, "Page title missing SolTerra"

        h1 = await page.inner_text("h1")
        print(f"   H1 Headline: '{h1.strip().replace(chr(10), ' ')}'")
        assert "Step Away From the Screen" in h1, "H1 headline mismatch"

        # Capture 01: Hero & Trails
        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "01_hero_and_trails.png"))
        print("   ✔ Captured 01_hero_and_trails.png")

        # 2. Check Solar Horizon Canvas
        print("2. Verifying Solar Horizon Canvas...")
        canvas = await page.query_selector("canvas")
        assert canvas is not None, "Canvas element missing!"
        box = await canvas.bounding_box()
        assert box['width'] > 200 and box['height'] > 100, f"Canvas too small: {box}"
        print(f"   Canvas dimensions verified: {int(box['width'])}x{int(box['height'])}px")

        # Capture 02: Horizon Chart
        chart_section = await page.query_selector("canvas")
        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "02_solar_horizon_chart.png"))
        print("   ✔ Captured 02_solar_horizon_chart.png")

        # 3. Check Field Card & Metrics
        print("3. Verifying Tactile Field Card...")
        slip_text = await page.inner_text(".printable-pocket-slip")
        assert "Turnaround Cue" in slip_text, "Missing Turnaround Cue"
        assert "Ridge Shadow" in slip_text, "Missing Ridge Shadow"
        assert "Thermal Plunge" in slip_text, "Missing Thermal Plunge"
        print("   Tactile Field Card metrics confirmed!")

        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "03_expedition_field_card.png"))
        print("   ✔ Captured 03_expedition_field_card.png")

        # 4. Trail Switching Interaction
        print("4. Testing Trail Switching to Boulder Flatirons...")
        flatirons_card = page.locator("text=Chautauqua Mesa & Royal Arch")
        await flatirons_card.click()
        await page.wait_for_timeout(800)

        updated_slip = await page.inner_text(".printable-pocket-slip")
        assert "Chautauqua Mesa" in updated_slip, "Trail did not update to Chautauqua Mesa"
        print("   ✔ Trail switched successfully to Chautauqua Mesa & recalculated!")

        # 5. Custom GPS Mode Interaction
        print("5. Testing Custom GPS Coordinates Mode...")
        custom_card = page.locator("text=Custom Trail Coordinates")
        await custom_card.click()
        await page.wait_for_timeout(500)

        # Adjust western barrier slider via evaluate for React range input
        await page.evaluate("""() => {
            const s = document.querySelector("input[type='range']");
            if (s) {
                s.value = "28";
                s.dispatchEvent(new Event('input', { bubbles: true }));
                s.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }""")
        await page.wait_for_timeout(800)

        custom_slip = await page.inner_text(".printable-pocket-slip")
        assert "Custom Waypoint" in custom_slip, "Did not switch to Custom Waypoint"
        assert "Obstruction" in custom_slip, "Barrier obstruction text missing"
        print("   ✔ Custom GPS coordinates mode verified!")

        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "04_custom_gps_mode.png"))
        print("   ✔ Captured 04_custom_gps_mode.png")

        # Switch back to Mount Rainier
        await page.locator("text=Skyline Trail & Panorama Point").click()
        await page.wait_for_timeout(500)

        # 6. Test DigitalOcean Architecture Modal
        print("6. Testing DigitalOcean Architecture Modal...")
        do_btn = page.locator("button:has-text('DO Engine')")
        await do_btn.click()
        await page.wait_for_timeout(600)

        modal_text = await page.inner_text(".field-card:has-text('DigitalOcean Serverless Inference Architecture')")
        assert "$0.0002" in modal_text, "Missing cost metric in DO modal"
        assert "gemma-4-31B-it" in modal_text, "Missing model target in DO modal"
        print("   ✔ DigitalOcean Architecture modal opened and verified!")

        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "06_digitalocean_architecture_modal.png"))
        print("   ✔ Captured 06_digitalocean_architecture_modal.png")

        # Close modal
        close_btn = page.locator("button:has-text('Close Inspector')")
        await close_btn.click()
        await page.wait_for_timeout(400)

        # 7. Test Rhodopsin Night-Vision Pocket Mode
        print("7. Testing Rhodopsin Night-Vision Pocket Mode (Screen Lockout)...")
        pocket_btn = page.locator("button:has-text('Pocket Mode (Touch Grass)')")
        await pocket_btn.click()
        await page.wait_for_timeout(800)

        lockout_text = await page.inner_text("div:has-text('Rhodopsin Night-Vision Mode')")
        assert "Countdown to" in lockout_text, "Missing countdown in Pocket Mode"
        assert "Your phone is stowed in your jacket pocket" in lockout_text, "Missing Touch Grass mandate text"
        print("   ✔ Pocket Mode lockout and live countdown confirmed!")

        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "05_pocket_mode_night_vision.png"))
        print("   ✔ Captured 05_pocket_mode_night_vision.png")

        # Exit Pocket Mode
        unlock_btn = page.locator("button:has-text('Unlock Screen')")
        await unlock_btn.click()
        await page.wait_for_timeout(500)

        # 8. Mobile Responsive Viewport (375x812 iPhone / Android)
        print("8. Testing Mobile Viewport (375x812)...")
        mobile_context = await browser.new_context(
            viewport={'width': 375, 'height': 812},
            device_scale_factor=2.0
        )
        mobile_page = await mobile_context.new_page()
        await mobile_page.goto(BASE_URL, wait_until="networkidle")
        await mobile_page.wait_for_timeout(800)

        await mobile_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "07_mobile_responsive_view.png"), full_page=True)
        print("   ✔ Captured 07_mobile_responsive_view.png (Full Mobile Page)")

        # Review Console Errors
        print("\n--- Console and Error Audit ---")
        real_errors = [e for e in console_errors if "favicon" not in e.lower()]
        print(f"Total Console Errors: {len(real_errors)}")
        for err in real_errors:
            print(f"   Console Error: {err}")
        print(f"Total Page/Runtime Errors: {len(page_errors)}")
        for err in page_errors:
            print(f"   Page Error: {err}")

        assert len(real_errors) == 0, f"Found unexpected console errors: {real_errors}"
        assert len(page_errors) == 0, f"Found unhandled page errors: {page_errors}"

        await browser.close()

    print("\n🎉 ALL E2E VERIFICATION TESTS PASSED SUCCESSFULLY WITH ZERO ERRORS!")

if __name__ == "__main__":
    asyncio.run(run_e2e())
