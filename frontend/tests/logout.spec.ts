import { test, expect } from '@playwright/test';

test('logout', async ({ page }) => {
    test.setTimeout(10000);
  
    // Navigate to the page
  await page.goto('http://localhost:3000');

  // Create a new user
  const name = 'Test User';
  const email = 'testuser@example.com';
  const username = 'testuser';
  const password = 'password123';

  await page.fill('input[name="create_user_form_name"]', name);
  await page.fill('input[name="create_user_form_email"]', email);
  await page.fill('input[name="create_user_form_username"]', username);
  await page.fill('input[name="create_user_form_password"]', password);
  await page.click('button[name="create_user_form_create_user"]');
  
  // Wait for user creation to complete (adjust timeout if necessary)
  await page.waitForTimeout(1000); 

  // Step 2: Log in with the newly created user
  await page.fill('input[name="login_form_username"]', username);
  await page.fill('input[name="login_form_password"]', password);
  await page.click('button[name="login_form_login"]');
  
  // Wait for login to complete
//   await page.waitForTimeout(2000);

//   // Verify that the "Hi Test User" message appears
//   const loggedInDiv = await page.waitForSelector('text=Hi Test User', { timeout: 10000 });
//   expect(loggedInDiv).not.toBeNull();

  // Log out
  await page.click('button[name="logout"]');
  
  // Wait for logout to complete
//   await page.waitForTimeout(2000);

  // Verify that "Hi Test User" message no longer appears
  const hiMessageAfterLogout = await page.textContent('h1');
  expect(hiMessageAfterLogout).not.toContain(`Hi Test User`);

  // Verify that "Create user" and "Login" buttons are visible again
  const createUserButtonVisible = await page.isVisible('button[name="create_user_form_create_user"]');
  expect(createUserButtonVisible).toBe(true);

  const loginButtonVisible = await page.isVisible('button[name="login_form_login"]');
  expect(loginButtonVisible).toBe(true);
});
