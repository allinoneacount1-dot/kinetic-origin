import subprocess, time, sys
from playwright.sync_api import sync_playwright

URL = "http" + "://127.0.0.1:4173"
proc = subprocess.Popen(
    ["pnpm", "preview", "--port", "4173", "--host", "127.0.0.1"],
    cwd=r"D:\Gemini-Projects\kinetic-origin",
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    shell=True,
)
time.sleep(3)

console_errors = []
page_errors = []

try:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe",
            headless=True,
        )
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: page_errors.append(str(e)))

        page.goto(URL, wait_until="networkidle")
        time.sleep(1)

        # 1. Verify all images loaded (naturalWidth > 0)
        imgs = page.evaluate("""() => Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.getAttribute('src'),
            complete: img.complete,
            w: img.naturalWidth,
            h: img.naturalHeight
        }))""")
        broken = [i for i in imgs if not i["complete"] or i["w"] == 0]
        print(f"IMAGES_CHECK total={len(imgs)} broken={len(broken)}")
        if broken:
            raise AssertionError(f"Broken images: {broken}")

        # 2. Motion toggle button
        motion_btn = page.get_by_role("button", name="Motion: Full")
        motion_btn.click()
        page.get_by_role("button", name="Motion: Calm").wait_for(timeout=3000)
        print("MOTION_TOGGLE_OK")

        # 3. Extraction Lab preset + timer + copy
        page.get_by_role("button", name="Origami Sweet").click()
        page.get_by_role("button", name="Start Pour").click()
        time.sleep(1.5)
        page.get_by_role("button", name="Pause").click()
        page.get_by_role("button", name="Copy Brew Sheet").click()
        page.get_by_role("button", name="Recipe Copied").wait_for(timeout=3000)
        print("EXTRACTION_LAB_OK")

        # 4. Micro-Lot filter + Sensory Drawer + Add to Bag + Checkout
        page.get_by_role("tab", name="Honey").click()
        page.get_by_role("button", name="Sensory Sheet").first.click()
        page.get_by_role("dialog").get_by_role("button", name="Add to Bag").click()
        page.get_by_role("button", name="Open shopping bag with 1 items").click()
        page.get_by_placeholder("ORIGIN10").fill("ORIGIN10")
        page.get_by_role("button", name="Apply").click()
        page.get_by_text("ORIGIN10 applied").wait_for(timeout=3000)
        page.get_by_placeholder("Your Name").fill("Satria")
        page.get_by_placeholder("Email for roast tracking").fill("satria@kineticorigin.id")
        page.get_by_role("dialog").locator("form button[type='submit']").click()
        page.get_by_text("ROAST QUEUED").wait_for(timeout=3000)
        page.get_by_role("button", name="Continue Exploring").click()
        print("BAG_CHECKOUT_OK")

        # 5. Cupping Reservation
        page.get_by_placeholder("Full Name").fill("Satria Arif")
        page.get_by_placeholder("Email or WhatsApp").fill("satria@kineticorigin.id")
        page.get_by_role("button", name="Confirm Cupping Pass").click()
        page.get_by_text("SEAT CONFIRMED").wait_for(timeout=3000)
        print("CUPPING_RESERVATION_OK")

        # 6. Footer newsletter
        page.get_by_placeholder("you@domain.com").fill("brew@kineticorigin.id")
        page.get_by_role("button", name="Join").click()
        page.get_by_text("harvest dispatch list").wait_for(timeout=3000)
        print("NEWSLETTER_OK")

        print(f"CONSOLE_ERRORS={len(console_errors)} PAGE_ERRORS={len(page_errors)}")
        if console_errors or page_errors:
            print("ERRORS:", console_errors, page_errors)
            sys.exit(1)

        page.close()
finally:
    proc.terminate()
    try:
        proc.wait(timeout=5)
    except Exception:
        proc.kill()
