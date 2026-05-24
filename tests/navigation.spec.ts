import { test, expect } from '@playwright/test';

const pages = ['/', '/about', '/writing', '/contact'];

for (const path of pages) {
  test(`${path} loads without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto(path);
    expect(errors).toHaveLength(0);
  });
}

test('nav links resolve between pages', async ({ page }) => {
  await page.goto('/');

  await page.click('nav a[href="/about"]');
  await expect(page).toHaveURL('/about');

  await page.click('nav a[href="/writing"]');
  await expect(page).toHaveURL('/writing');

  await page.click('nav a[href="/contact"]');
  await expect(page).toHaveURL('/contact');

  await page.click('nav a[href="/"]');
  await expect(page).toHaveURL('/');
});

test('external links have target="_blank" and rel="noopener"', async ({ page }) => {
  await page.goto('/about');

  const externalLinks = page.locator('a[href^="http"]:not([href^="http://localhost"])');
  const count = await externalLinks.count();

  for (let i = 0; i < count; i++) {
    const link = externalLinks.nth(i);
    await expect(link).toHaveAttribute('target', '_blank');
    const rel = await link.getAttribute('rel');
    expect(rel).toContain('noopener');
  }
});
