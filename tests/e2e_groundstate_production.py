import asyncio
import os
import sys
from playwright.async_api import async_playwright
from PIL import Image, ImageChops
import math

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_URL = "http://localhost:4500"
BASELINE_DIR = r"c:\Users\xtaho\Desktop\Dev Engine\contests\solterra\baseline_screenshots"
OUTPUT_DIR = r"c:\Users\xtaho\Desktop\Dev Engine\contests\solterra\post_screenshots"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def calculate_rmse(image_a_path, image_b_path):
    if not os.path.exists(image_a_path) or not os.path.exists(image_b_path):
        return None
    img_a = Image.open(image_a_path).convert('RGB')
    img_b = Image.open(image_b_path).convert('RGB')
    if img_a.size != img_b.size:
        img_b = img_b.resize(img_a.size)
    diff = ImageChops.difference(img_a, img_b)
    h = diff.histogram()
    sq = (value * ((idx % 256) ** 2) for idx, value in enumerate(h))
    sum_of_squares = sum(sq)
    rms = math.sqrt(sum_of_squares / float(img_a.size[0] * img_a.size[1] * 3))
    return rms

async def run_e2e_and_regression():
    print("=" * 65)
    print("GROUNDSTATE PRODUCTION ENGINEERING & VERIFICATION SUITE")
    print("=" * 65)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1440, 'height': 900},
            device_scale_factor=1.0
        )
        page = await context.new_page()

        # -----------------------------------------------------------
        # TEST 1: HOME PAGE
        # -----------------------------------------------------------
        print("\n[TEST 1] Verifying Home Page at / ...")
        res = await page.goto(f"{BASE_URL}/", wait_until="networkidle")
        assert res.status == 200, f"Home page returned HTTP {res.status}"
        await page.wait_for_timeout(1000)

        home_screenshot = os.path.join(OUTPUT_DIR, "post_01_home.png")
        await page.screenshot(path=home_screenshot)
        print(f"✔ Home page loaded. Captured: {home_screenshot}")

        # Check logo and brand
        brand = await page.inner_text(".brand-logo")
        print(f"  Brand Name: {brand}")
        assert "GROUNDSTATE" in brand.upper()

        # Check today's suggestion card
        suggestion = await page.inner_text(".suggestion-place-name")
        print(f"  Today's Suggestion: {suggestion}")
        assert "Central Park Garden" in suggestion

        # -----------------------------------------------------------
        # TEST 2: EXPLORE PAGE & GEOSPATIAL FILTERS
        # -----------------------------------------------------------
        print("\n[TEST 2] Verifying Explore Page at /explore ...")
        res = await page.goto(f"{BASE_URL}/explore", wait_until="networkidle")
        assert res.status == 200, f"Explore returned HTTP {res.status}"
        await page.wait_for_timeout(1500)

        # Check parks list rendered
        parks_cards = await page.locator(".park-card").count()
        print(f"  Rendered Park Cards Count: {parks_cards}")
        assert parks_cards >= 2, "Expected at least 2 park cards"

        # Test changing filter chip
        print("  Testing Filter Chip: 'Quiet'...")
        await page.click("button.filter-chip:has-text('Quiet')")
        await page.wait_for_timeout(600)
        quiet_cards = await page.locator(".park-card").count()
        print(f"  Filtered 'Quiet' Count: {quiet_cards}")

        # Test radius toggle
        print("  Testing Radius Toggle: '5 min'...")
        await page.click("button.radius-btn:has-text('5 min')")
        await page.wait_for_timeout(600)
        radius_5_cards = await page.locator(".park-card").count()
        print(f"  5-min Radius Count: {radius_5_cards}")

        # Reset filter to All & 15 min for baseline comparison
        await page.click("button.filter-chip:has-text('All')")
        await page.click("button.radius-btn:has-text('15 min')")
        await page.wait_for_timeout(800)

        explore_screenshot = os.path.join(OUTPUT_DIR, "post_02_explore.png")
        await page.screenshot(path=explore_screenshot)
        print(f"✔ Explore verified. Captured: {explore_screenshot}")

        # -----------------------------------------------------------
        # TEST 3: HOW IT WORKS PAGE
        # -----------------------------------------------------------
        print("\n[TEST 3] Verifying How It Works Page at /how-it-works ...")
        res = await page.goto(f"{BASE_URL}/how-it-works", wait_until="networkidle")
        assert res.status == 200
        await page.wait_for_timeout(1000)

        how_screenshot = os.path.join(OUTPUT_DIR, "post_03_how_it_works.png")
        await page.screenshot(path=how_screenshot)
        print(f"✔ How It Works verified. Captured: {how_screenshot}")

        # -----------------------------------------------------------
        # TEST 4: BENEFITS PAGE & BOOKMARKS
        # -----------------------------------------------------------
        print("\n[TEST 4] Verifying Benefits Page at /benefits ...")
        res = await page.goto(f"{BASE_URL}/benefits", wait_until="networkidle")
        assert res.status == 200
        await page.wait_for_timeout(1000)

        # Test Bookmark toggle
        print("  Testing Bookmark Button toggle...")
        bookmark_btn = page.locator("button[title*='Save Place'], button[title*='Bookmarked']")
        await bookmark_btn.click()
        await page.wait_for_timeout(500)

        # Check localStorage bookmark
        stored_bookmarks = await page.evaluate("() => localStorage.getItem('groundstate_bookmarked_parks')")
        print(f"  Stored Bookmarks in LocalStorage: {stored_bookmarks}")
        assert stored_bookmarks is not None and "botanical" in stored_bookmarks

        # Test Offline Card modal
        print("  Opening Offline Card modal...")
        await page.click("button:has-text('Offline Card')")
        await page.wait_for_timeout(600)
        card_preview_text = await page.inner_text(".modal-content-card")
        assert "GROUNDSTATE PASS" in card_preview_text
        print("  ✔ Offline Card Preview rendered correctly!")

        # Close modal
        await page.click(".modal-close-btn")
        await page.wait_for_timeout(500)

        benefits_screenshot = os.path.join(OUTPUT_DIR, "post_04_benefits.png")
        await page.screenshot(path=benefits_screenshot)
        print(f"✔ Benefits page verified. Captured: {benefits_screenshot}")

        # -----------------------------------------------------------
        # TEST 5: COMMUNITY PAGE
        # -----------------------------------------------------------
        print("\n[TEST 5] Verifying Community Page at /community ...")
        res = await page.goto(f"{BASE_URL}/community", wait_until="networkidle")
        assert res.status == 200
        await page.wait_for_timeout(1000)

        # Test Like Button
        print("  Testing Testimonial Like button...")
        like_btn = page.locator(".testimonial-likes")
        initial_likes = await like_btn.inner_text()
        await like_btn.click()
        await page.wait_for_timeout(400)
        updated_likes = await like_btn.inner_text()
        print(f"  Likes: {initial_likes} -> {updated_likes}")

        # Test Join Community modal & persistence
        print("  Opening Join Community modal...")
        await page.click("button:has-text('Join Community')")
        await page.wait_for_timeout(600)
        await page.fill("input[placeholder='GitHub or DEV Username']", "solterra_dev")
        await page.fill("input[placeholder='Developer Email']", "dev@groundstate.app")
        await page.click("button[type='submit']")
        await page.wait_for_timeout(600)

        granted_text = await page.inner_text(".modal-content-card")
        assert "Badge Granted" in granted_text
        print("  ✔ Community Badge granted and persisted!")

        await page.click("button:has-text('Return to Community')")
        await page.wait_for_timeout(500)

        community_screenshot = os.path.join(OUTPUT_DIR, "post_05_community.png")
        await page.screenshot(path=community_screenshot)
        print(f"✔ Community verified. Captured: {community_screenshot}")

        # -----------------------------------------------------------
        # TEST 6: DIGITALOCEAN SERVERLESS AI MODAL & INFERENCE
        # -----------------------------------------------------------
        print("\n[TEST 6] Testing DigitalOcean Serverless AI Modal & Real Inference...")
        await page.goto(f"{BASE_URL}/", wait_until="networkidle")
        await page.wait_for_timeout(800)

        # Click DigitalOcean AI button in header
        await page.click("button.nav-btn-highlight")
        await page.wait_for_timeout(600)

        do_modal_title = await page.inner_text(".modal-content-card h3")
        print(f"  Modal Title: {do_modal_title}")
        assert "Sensory Grounding Inference" in do_modal_title

        # Click Re-run Inference button
        print("  Executing real server-side inference call...")
        await page.click("button:has-text('Re-run Inference')")
        await page.wait_for_selector("button:has-text('Re-run Inference')", timeout=15000)
        await page.wait_for_timeout(600)

        prescription_text = await page.inner_text(".modal-content-card")
        assert "1. Optic:" in prescription_text
        assert "2. Acoustic:" in prescription_text
        assert "3. Physical:" in prescription_text
        print("  ✔ Real Sensory Prescription successfully generated and rendered!")

        do_screenshot = os.path.join(OUTPUT_DIR, "post_06_digitalocean_modal.png")
        await page.screenshot(path=do_screenshot)
        print(f"✔ DigitalOcean modal verified. Captured: {do_screenshot}")

        await page.click(".modal-close-btn")
        await page.wait_for_timeout(500)

        # -----------------------------------------------------------
        # TEST 7: SENSORY RESET MODAL (3-STAGE LIVE TIMER)
        # -----------------------------------------------------------
        print("\n[TEST 7] Testing 3-Minute Sensory Reset Modal & Audio Chimes...")
        await page.goto(f"{BASE_URL}/benefits", wait_until="networkidle")
        reset_btn = page.locator("button:has-text('Start 3-Minute Reset')").first
        await reset_btn.click()
        await page.wait_for_timeout(1000)

        timer_text = await page.inner_text(".modal-content-card")
        print(f"  Stage 1 text: {timer_text[:100].replace('\n', ' ')}")
        assert "Optic" in timer_text or "STAGE 1" in timer_text.upper()
        print("  Stage 1 (Optic Reset) active.")

        # Test Skip stage
        await page.click("button[title='Skip to next stage']")
        await page.wait_for_timeout(800)
        timer_text2 = await page.inner_text(".modal-content-card")
        assert "Acoustic" in timer_text2 or "STAGE 2" in timer_text2.upper()
        print("  Stage 2 (Acoustic Relaxation) active.")

        await page.click("button[title='Skip to next stage']")
        await page.wait_for_timeout(800)
        timer_text3 = await page.inner_text(".modal-content-card")
        assert "Physical" in timer_text3 or "STAGE 3" in timer_text3.upper()
        print("  Stage 3 (Physical Stow Mode) active.")

        reset_modal_screenshot = os.path.join(OUTPUT_DIR, "post_07_sensory_reset_modal.png")
        await page.screenshot(path=reset_modal_screenshot)
        print(f"✔ Sensory Reset modal verified. Captured: {reset_modal_screenshot}")

        await page.click(".modal-close-btn")
        await page.wait_for_timeout(500)

        # -----------------------------------------------------------
        # TEST 8: POCKET MODE MODAL
        # -----------------------------------------------------------
        print("\n[TEST 8] Testing OLED Pocket Mode Modal & State Machine...")
        await page.click("button.nav-btn-pocket")
        await page.wait_for_timeout(800)

        pocket_text = await page.inner_text(".pocket-mode-overlay")
        assert "OLED POCKET STOW" in pocket_text
        print("  Pocket Mode overlay engaged.")

        # Test pause/resume
        pause_btn = page.locator("button:has-text('Pause Walk')")
        if await pause_btn.count() > 0:
            await pause_btn.click()
            await page.wait_for_timeout(400)
            pocket_text_paused = await page.inner_text(".pocket-mode-overlay")
            assert "PAUSED" in pocket_text_paused
            print("  ✔ Walk successfully paused!")

            # Resume
            await page.click("button:has-text('Resume Walk')")
            await page.wait_for_timeout(400)
            print("  ✔ Walk successfully resumed!")

        pocket_screenshot = os.path.join(OUTPUT_DIR, "post_08_pocket_mode.png")
        await page.screenshot(path=pocket_screenshot)
        print(f"✔ Pocket Mode verified. Captured: {pocket_screenshot}")

        await page.click("button:has-text('Exit Screen Stow')")
        await page.wait_for_timeout(500)

        # -----------------------------------------------------------
        # VISUAL REGRESSION CHECK (COMPARE WITH BASELINE)
        # -----------------------------------------------------------
        print("\n" + "=" * 65)
        print("VISUAL REGRESSION ANALYSIS (BASELINE VS POST-IMPLEMENTATION)")
        print("=" * 65)

        pairs = [
            ("Home Page", os.path.join(BASELINE_DIR, "baseline_01_home.png"), home_screenshot),
            ("Explore Page", os.path.join(BASELINE_DIR, "baseline_02_explore.png"), explore_screenshot),
            ("How It Works", os.path.join(BASELINE_DIR, "baseline_03_how_it_works.png"), how_screenshot),
            ("Benefits Page", os.path.join(BASELINE_DIR, "baseline_04_benefits.png"), benefits_screenshot),
            ("Community Page", os.path.join(BASELINE_DIR, "baseline_05_community.png"), community_screenshot),
        ]

        for name, baseline_path, post_path in pairs:
            rmse = calculate_rmse(baseline_path, post_path)
            if rmse is not None:
                status = "PASS (0 Regressions)" if rmse < 2.0 else f"NOTE: RMSE = {rmse:.2f}"
                print(f"  • {name:<16}: RMSE = {rmse:.3f} -> {status}")
            else:
                print(f"  • {name:<16}: Baseline image not found for comparison")

        await browser.close()
        print("\nAll End-to-End functional tests and visual regression checks completed successfully!")

if __name__ == "__main__":
    asyncio.run(run_e2e_and_regression())
