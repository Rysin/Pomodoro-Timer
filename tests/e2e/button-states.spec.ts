import { test, expect } from '@playwright/test';

test.describe('SCRUM-21 button hover/active states', () => {
  test.beforeEach(async ({ page }) => {
    // Prefer BASE_URL, fallback to Vite preview default.
    const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  });

  test('controls are visible and focus-visible is not broken', async ({ page }) => {
    const start = page.getByRole('button', { name: /start/i });
    const pause = page.getByRole('button', { name: /pause/i });
    const reset = page.getByRole('button', { name: /reset/i });

    await expect(start).toBeVisible();
    await expect(pause).toBeVisible();
    await expect(reset).toBeVisible();

    // Keyboard focus smoke check (avoid pixel-perfect outline asserts).
    await page.keyboard.press('Tab');
    await expect(start).toBeFocused();
  });

  test('enabled Start button shows pressed styles while mouse is down (transform/shadow/filter)', async ({ page }) => {
    const start = page.getByRole('button', { name: /start/i });
    await expect(start).toBeEnabled();

    const before = await start.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, boxShadow: cs.boxShadow, filter: cs.filter };
    });

    const box = await start.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();

    const during = await start.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, boxShadow: cs.boxShadow, filter: cs.filter };
    });

    expect(during.transform).not.toBe(before.transform);
    expect(during.boxShadow).not.toBe(before.boxShadow);
    expect(during.filter).not.toBe(before.filter);

    await page.mouse.up();

    const after = await start.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, boxShadow: cs.boxShadow, filter: cs.filter };
    });

    expect(after.transform).toBe(before.transform);
    expect(after.boxShadow).toBe(before.boxShadow);
  });

  test('disabled Start button does not apply :active styling (regression guard for :not(:disabled)))', async ({ page }) => {
    const start = page.getByRole('button', { name: /start/i });

    // Start timer to disable Start (typical Pomodoro UX).
    await start.click();
    await expect(start).toBeDisabled();

    const before = await start.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, boxShadow: cs.boxShadow, filter: cs.filter };
    });

    const box = await start.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();

    const during = await start.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, boxShadow: cs.boxShadow, filter: cs.filter };
    });

    // Buttons have :not(:disabled):active selector, so styles should not change.
    expect(during.transform).toBe(before.transform);
    expect(during.boxShadow).toBe(before.boxShadow);
    expect(during.filter).toBe(before.filter);

    await page.mouse.up();
  });

  test('Enable notifications button shows pressed state when enabled', async ({ page }) => {
    const notify = page.getByRole('button', { name: /enable notifications/i });
    await expect(notify).toBeVisible();
    await expect(notify).toBeEnabled();

    const before = await notify.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, boxShadow: cs.boxShadow, filter: cs.filter };
    });

    const box = await notify.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();

    const during = await notify.evaluate((el) => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, boxShadow: cs.boxShadow, filter: cs.filter };
    });

    expect(during.transform).not.toBe(before.transform);
    expect(during.boxShadow).not.toBe(before.boxShadow);
    expect(during.filter).not.toBe(before.filter);

    await page.mouse.up();
  });
});
