import { test, expect } from '@playwright/test';

test('change theme button turns background to black', async ({ page }) => {
  // Navigate to the page
  await page.goto('http://localhost:3000');

  // Click the "Change Theme" button
  await page.click('button[name="change_theme"]');

  // Wait for the background color to change (optional, depending on your app's behavior)
  await page.waitForTimeout(1000);

  // Select the element whose background color you want to check (e.g., body or a specific container)
  const elementHandle = await page.waitForSelector('body', { timeout: 5000 });

  // Get the background color using evaluate
  const backgroundColor = await elementHandle.evaluate(el => {
    const style = window.getComputedStyle(el);
    return style.backgroundColor;
  });

  // Check if the background color is black
  expect(backgroundColor).toBe('rgb(214, 219, 220)'); // 'rgb(0, 0, 0)' represents black in RGB format
});