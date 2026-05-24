import { test, expect } from '@playwright/test';

// Sample essay one has video fields including freeze_at
const ESSAY_URL = '/writing/sample-essay-one';

test('VideoEntrance renders on essay pages with video fields', async ({ page }) => {
  await page.goto(ESSAY_URL);
  await expect(page.locator('#video-entrance')).toBeVisible();
});

test('video element has autoplay and muted attributes', async ({ page }) => {
  await page.goto(ESSAY_URL);
  const video = page.locator('#entrance-video');
  await expect(video).toHaveAttribute('autoplay', '');
  await expect(video).toHaveAttribute('muted', '');
});

test('poster image is present in DOM when freeze_at is set', async ({ page }) => {
  await page.goto(ESSAY_URL);
  // sample-essay-one has freeze_at: 13.5 and poster fields
  await expect(page.locator('#video-poster')).toBeAttached();
});

test('scroll past 300px causes video-entrance opacity to reach 0', async ({ page }) => {
  await page.goto(ESSAY_URL);

  const initialOpacity = await page.locator('#video-entrance').evaluate(
    (el) => window.getComputedStyle(el).opacity
  );
  expect(parseFloat(initialOpacity)).toBeCloseTo(1, 1);

  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(100);

  const afterOpacity = await page.locator('#video-entrance').evaluate(
    (el) => (el as HTMLElement).style.opacity
  );
  expect(parseFloat(afterOpacity)).toBe(0);
});

test('mute toggle button is present and changes video.muted on click', async ({ page }) => {
  await page.goto(ESSAY_URL);

  const muteBtn = page.locator('#mute-toggle');
  await expect(muteBtn).toBeVisible();

  const mutedBefore = await page.locator('#entrance-video').evaluate(
    (el) => (el as HTMLVideoElement).muted
  );
  expect(mutedBefore).toBe(true);

  await muteBtn.click();

  const mutedAfter = await page.locator('#entrance-video').evaluate(
    (el) => (el as HTMLVideoElement).muted
  );
  expect(mutedAfter).toBe(false);
});
