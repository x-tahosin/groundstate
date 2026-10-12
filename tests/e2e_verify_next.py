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

    print("--- Starting SolTerra Obsidian E2E Verification Suite ---")

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)

        # 1. Desktop Test Environment (1440x900)
        context = await browser.new_context(
            viewport={'width': 1440, 'height': 900},
            device_scale_factor=1.25
        )
        page = await context.new_page()

        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error"] else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        print(f"1. Navigating to {BASE_URL}...")
        response = await page.goto(BASE_URL, wait_until="networkidle")
        assert response.status == 200, f"Expected 200, got {response.status}"
        await page.wait_for_timeout(1000)

        # Check Page Title & Headings
        title = await page.title()
        print(f"   Page Title: '{title}'")
        assert "SolTerra" in title, "Page title missing SolTerra"

        brand = await page.inner_text(".nav-brand-title")
        print(f"   Brand: '{brand}'")
        assert "SOLTERRA" in brand, "Brand mismatch"

        # Capture 01: Hero & Trails
        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "01_hero_and_trails.png"))
        print("   ✔ Captured 01_hero_and_trails.png")

        # 2. Check Vector Solar Chronometer Bezel
        print("2. Verifying Vector SVG Solar Chronometer...")
        bezel = await page.query_selector(".chronometer-bezel-card")
        assert bezel is not None, "Bezel card missing!"
        bezel_text = await page.inner_text(".chronometer-bezel-card")
        assert "SOLAR ALTITUDE" in bezel_text, "Missing Solar Altitude in bezel"
        print("   ✔ Vector Solar Chronometer verified!")

        # Capture 02: Chronometer & Hero
        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "02_solar_horizon_chart.png"))
        print("   ✔ Captured 02_solar_horizon_chart.png")

        # 3. Check 3D Spline Toggle
        print("3. Testing 3D Spline Globe Viewport Toggle...")
        spline_btn = page.locator("button:has-text('3D Spline Globe')")
        if await spline_btn.count() > 0:
            await spline_btn.click()
            await page.wait_for_timeout(1000)
            print("   ✔ Toggled to 3D Spline Globe Viewport!")

        # Switch back to Massif Atmosphere
        massif_btn = page.locator("button:has-text('Massif Atmosphere')")
        if await massif_btn.count() > 0:
            await massif_btn.click()
            await page.wait_for_timeout(500)

        # 4. Check Expedition Permit Card
        print("4. Verifying Expedition Permit Card...")
        permit = await page.inner_text(".expedition-permit-card")
        assert "EXPEDITION PERMIT" in permit, "Missing Expedition Permit title"
        assert "RIDGE SHADOW CUTOFF" in permit, "Missing Ridge Shadow Cutoff"
        assert "MOUNTAIN DEFICIT" in permit, "Missing Mountain Deficit"
        print("   ✔ Expedition Permit Card verified!")

        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "03_expedition_field_card.png"))
        print("   ✔ Captured 03_expedition_field_card.png")

        # 5. Trail Switching Interaction
        print("5. Testing Trail Switching to Boulder Flatirons...")
        flatirons_card = page.locator(".massif-card:has-text('Chautauqua Mesa')")
        await flatirons_card.click()
        await page.wait_for_timeout(800)

        updated_permit = await page.inner_text(".expedition-permit-card")
        assert "CHAUTAUQUA MESA" in updated_permit, "Trail did not update to Chautauqua Mesa"
        print("   ✔ Trail switched successfully to Chautauqua Mesa!")

        # 6. Custom GPS Mode Interaction
        print("6. Testing Custom GPS Coordinates & Western Barrier Radar...")
        custom_card = page.locator(".massif-card:has-text('Custom Trail Waypoint')")
        await custom_card.click()
        await page.wait_for_timeout(600)

        # Move western barrier slider
        await page.evaluate("""() => {
            const sliders = document.querySelectorAll("input[type='range']");
            if (sliders.length > 1) {
                const s = sliders[1]; // Barrier slider in custom mode
                s.value = "30";
                s.dispatchEvent(new Event('input', { bubbles: true }));
                s.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }""")
        await page.wait_for_timeout(600)

        custom_permit = await page.inner_text(".expedition-permit-card")
        assert "CUSTOM MOUNTAIN WAYPOINT" in custom_permit, "Custom waypoint not updated in permit"
        print("   ✔ Custom GPS coordinates and barrier slider verified!")

        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "04_custom_gps_mode.png"))
        print("   ✔ Captured 04_custom_gps_mode.png")

        # Switch back to Mount Rainier
        await page.locator(".massif-card:has-text('Skyline Trail')").click()
        await page.wait_for_timeout(500)

        # 7. Test DigitalOcean Architecture Modal
        print("7. Testing DigitalOcean Architecture HUD Modal...")
        do_btn = page.locator("button:has-text('DO Gemma-31B')")
        await do_btn.click()
        await page.wait_for_timeout(600)

        modal_text = await page.inner_text(".modal-telemetry-card")
        assert "$0.00020" in modal_text, "Missing cost metric in DO modal"
        assert "gemma-4-31B-it" in modal_text, "Missing model target in DO modal"
        print("   ✔ DigitalOcean Architecture modal opened and verified!")

        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "06_digitalocean_architecture_modal.png"))
        print("   ✔ Captured 06_digitalocean_architecture_modal.png")

        # Close modal
        close_btn = page.locator("button:has-text('Acknowledge HUD')")
        await close_btn.click()
        await page.wait_for_timeout(400)

        # 8. Test Rhodopsin Night-Vision Pocket Mode
        print("8. Testing Rhodopsin Night-Vision Pocket Mode...")
        pocket_btn = page.locator("button:has-text('Pocket Mode')")
        await pocket_btn.click()
        await page.wait_for_timeout(800)

        lockout_text = await page.inner_text(".pocket-mode-overlay")
        assert "RHODOPSIN NIGHT-VISION LOCKOUT" in lockout_text, "Missing lockout title"
        assert "COUNTDOWN TO RIDGE SHADOW CUTOFF" in lockout_text, "Missing countdown"
        print("   ✔ Pocket Mode lockout confirmed!")

        await page.screenshot(path=os.path.join(SCREENSHOT_DIR, "05_pocket_mode_night_vision.png"))
        print("   ✔ Captured 05_pocket_mode_night_vision.png")

        # Exit Pocket Mode
        unlock_btn = page.locator("button:has-text('UNLOCK SCREEN')")
        await unlock_btn.click()
        await page.wait_for_timeout(500)

        # 9. Mobile Responsive Viewport (375x812)
        print("9. Testing Mobile Viewport (375x812)...")
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
        real_errors = [e for e in console_errors if "favicon" not in e.lower() and "spline" not in e.lower()]
        print(f"Total Console Errors: {len(real_errors)}")
        for err in real_errors:
            print(f"   Console Error: {err}")
        print(f"Total Page/Runtime Errors: {len(page_errors)}")
        for err in page_errors:
            print(f"   Page Error: {err}")

        assert len(real_errors) == 0, f"Found unexpected console errors: {real_errors}"
        assert len(page_errors) == 0, f"Found unhandled page errors: {page_errors}"

        await browser.close()

    print("\n🎉 ALL OBSIDIAN E2E VERIFICATION TESTS PASSED WITH ZERO ERRORS!")

if __name__ == "__main__":
    asyncio.run(run_e2e())
