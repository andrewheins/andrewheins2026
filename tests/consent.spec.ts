import { test, expect } from '@playwright/test';

test('GTM script is not present in DOM before consent', async ({ page }) => {
  await page.goto('/');
  const gtmScript = page.locator('#gtm-script');
  await expect(gtmScript).toHaveCount(0);
});

test('GTM script is injected into DOM after consent event fires', async ({ page }) => {
  await page.goto('/');

  await page.evaluate(() => {
    const event = new CustomEvent('cookieyes-consent-update', {
      detail: { analytics: 'yes' },
    });
    document.dispatchEvent(event);
  });

  await page.waitForTimeout(200);
  await expect(page.locator('#gtm-script')).toHaveCount(1);
});

test('submit button on contact form is enabled after consent event', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('#cf-submit')).toBeDisabled();

  await page.evaluate(() => {
    const event = new CustomEvent('cookieyes-consent-update', {
      detail: { analytics: 'yes' },
    });
    document.dispatchEvent(event);
  });

  await expect(page.locator('#cf-submit')).toBeEnabled();
});
