import { test, expect } from '@playwright/test';

test('H1 contains author full name on home page', async ({ page }) => {
  await page.goto('/');
  const h1 = page.locator('h1').first();
  await expect(h1).toContainText('Andrew Heins');
});

test('Person schema is present on home page', async ({ page }) => {
  await page.goto('/');
  const schema = await page.locator('script[type="application/ld+json"]').first().textContent();
  expect(schema).not.toBeNull();
  const parsed = JSON.parse(schema!);
  expect(parsed['@type']).toBe('Person');
  expect(parsed.sameAs).toBeDefined();
});

test('Author schema is present on article pages', async ({ page }) => {
  await page.goto('/writing/sample-essay-one');
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const personSchemas = schemas.filter((s) => {
    try { return JSON.parse(s)['@type'] === 'Person'; } catch { return false; }
  });
  expect(personSchemas.length).toBeGreaterThan(0);
});

const allPages = ['/', '/about', '/writing', '/contact'];

for (const path of allPages) {
  test(`OG meta tags are present on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(1);
  });

  test(`Canonical URL meta is present on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  });
}

test('sitemap returns 200 and contains essay URLs', async ({ page }) => {
  const response = await page.request.get('/sitemap-index.xml');
  expect(response.status()).toBe(200);

  // Follow the sitemap index to the actual sitemap
  const indexBody = await response.text();
  const sitemapUrlMatch = indexBody.match(/<loc>(.*?)<\/loc>/);
  if (sitemapUrlMatch) {
    const sitemapResponse = await page.request.get(sitemapUrlMatch[1].replace(/https?:\/\/[^/]+/, ''));
    const sitemapBody = await sitemapResponse.text();
    expect(sitemapBody).toContain('sample-essay-one');
    expect(sitemapBody).toContain('sample-essay-two');
  }
});

test('RSS feed returns 200 and is valid XML', async ({ page }) => {
  const response = await page.request.get('/rss.xml');
  expect(response.status()).toBe(200);

  const body = await response.text();
  expect(body).toContain('<?xml');
  expect(body).toContain('<channel>');
  expect(body).toContain('sample-essay-one');
  // Curated entries must not appear in RSS
  expect(body).not.toContain('sample-curated-one');
});
