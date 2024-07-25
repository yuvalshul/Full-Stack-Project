const { test, describe, expect } = require('@playwright/test')


  test('login is being done seccesfully', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    //create a user
    await page.fill('input[name="create_user_form_name"]', 'a user created by playwright1');
    await page.fill('input[name="create_user_form_email"]', 'playwright email1');
    await page.fill('input[name="create_user_form_username"]', 'playwright username1');
    await page.fill('input[name="create_user_form_password"]', 'playwright1234');
    await page.click('button[name="create_user_form_create_user"]');

    //login    
    // Fill in the login form
    await page.fill('input[name="login_form_username"]', 'playwright username1');
    await page.fill('input[name="login_form_password"]', 'playwright1234');

    // Submit the login form
    await page.click('button[name="login_form_login"]');

    // Wait for the "logged-in" text to be visible
    const loggedInDiv = await page.waitForSelector('text=Hi a user created by playwright1', { timeout: 10000 });
    expect(loggedInDiv).not.toBeNull();
  }, 15000);