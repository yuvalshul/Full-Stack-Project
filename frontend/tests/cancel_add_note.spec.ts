import { test, expect, request } from '@playwright/test';

test('filling text_input_new_note with content, clicking cancel and the input becomes empty', async ({ page, request }) => {
  await page.goto('http://localhost:3000');

  // Define the user data
  const userData = {
    name: 'a user created by playwright3',
    email: 'playwright email3',
    username: 'playwright username3',
    password: 'playwright1234',
  };

  // Send HTTP POST request to create the user
  const responseCreate = await request.post('http://localhost:3001/users', {
    data: userData,
  });

  // Ensure the user was created successfully
  expect(responseCreate.ok()).toBeTruthy();

  // Login
  await page.fill('input[name="login_form_username"]', 'playwright username3');
  await page.fill('input[name="login_form_password"]', 'playwright1234');
  await page.click('button[name="login_form_login"]');
  const loggedInDiv = await page.waitForSelector('text=Hi a user created by playwright3', { timeout: 10000 });
  expect(loggedInDiv).not.toBeNull();

  await page.click('button[name="add_new_note"]');
  await page.fill('input[name="text_input_new_note"]', 'temporary note content');
  await page.click('button[name="text_input_cancel_new_note"]');
  
  // Ensure the input field is empty after cancelling
  await page.click('button[name="add_new_note"]');
  const noteContentInput = await page.locator('input[name="text_input_new_note"]');
  const inputValue = await noteContentInput.inputValue();
  expect(inputValue).toBe('');
});
