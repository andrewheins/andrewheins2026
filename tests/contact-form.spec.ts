import { test, expect } from '@playwright/test';

test('contact form renders on contact page', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('#contact-form')).toBeVisible();
  await expect(page.locator('#cf-name')).toBeVisible();
  await expect(page.locator('#cf-email')).toBeVisible();
  await expect(page.locator('#cf-message')).toBeVisible();
});

test('submit button is disabled before consent cookie is set', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('#cf-submit')).toBeDisabled();
});

test('UTM params in URL are captured into sessionStorage on load', async ({ page }) => {
  await page.goto('/contact?utm_source=linkedin&utm_medium=social&utm_campaign=post');

  const utms = await page.evaluate(() => {
    const raw = sessionStorage.getItem('utm_params');
    return raw ? JSON.parse(raw) : null;
  });

  expect(utms).not.toBeNull();
  expect(utms.utm_source).toBe('linkedin');
  expect(utms.utm_medium).toBe('social');
  expect(utms.utm_campaign).toBe('post');
});

test('form shows success state on mocked Worker 200 response', async ({ page }) => {
  // Set consent cookie so submit button is enabled
  await page.context().addCookies([{
    name: 'cookieyes-consent',
    value: 'consentid=test,consent=yes,action=yes,analytics=yes',
    domain: 'localhost',
    path: '/',
  }]);

  await page.route('**/contact', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
  );

  await page.goto('/contact');
  await page.fill('#cf-name', 'Test User');
  await page.fill('#cf-email', 'test@example.com');
  await page.fill('#cf-message', 'Hello there.');
  await page.click('#cf-submit');

  await expect(page.locator('#form-success')).toBeVisible();
  await expect(page.locator('#form-fields')).toHaveClass(/hidden/);
});

test('form shows error state on mocked Worker 500 response', async ({ page }) => {
  await page.context().addCookies([{
    name: 'cookieyes-consent',
    value: 'consentid=test,consent=yes,action=yes,analytics=yes',
    domain: 'localhost',
    path: '/',
  }]);

  await page.route('**/contact', (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ success: false, error: 'server_error' }) })
  );

  await page.goto('/contact');
  await page.fill('#cf-name', 'Test User');
  await page.fill('#cf-email', 'test@example.com');
  await page.fill('#cf-message', 'Hello there.');
  await page.click('#cf-submit');

  await expect(page.locator('#form-error')).toBeVisible();
});
