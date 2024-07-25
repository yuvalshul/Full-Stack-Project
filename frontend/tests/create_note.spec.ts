import { test, expect, request } from '@playwright/test'

test('a new note can be created', async ({ page, request }) => {
    await page.goto('http://localhost:3000');
    //create a user
    // Define the user data
    const userData = {
        name: 'a user created by playwright2',
        email: 'playwright email2',
        username: 'playwright username2',
        password: 'playwright1234',
    };

    // Send HTTP POST request to create the user
    const responseCreate = await request.post('http://localhost:3001/users', {
        data: userData,
    });
    
    // Ensure the user was created successfully
    expect(responseCreate.ok()).toBeTruthy();

    
    // Send HTTP POST request to login into the created the user
    // const responseLogin = await request.post('http://localhost:3001/login', {
    //    data: {username: 'Alina', password: '1234'}
    // });
    
    // // Ensure successfully login
    // expect(responseLogin.ok()).toBeTruthy();
    
    //login    
    // Fill in the login form
    await page.fill('input[name="login_form_username"]', 'playwright username2');
    await page.fill('input[name="login_form_password"]', 'playwright1234');

    // Submit the login form
    await page.click('button[name="login_form_login"]');

    // Wait for the "logged-in" text to be visible
    const loggedInDiv = await page.waitForSelector('text=Hi a user created by playwright2', { timeout: 10000 });
    expect(loggedInDiv).not.toBeNull();

    //Add a new note in frontend
    
    await page.click('button[name="add_new_note"]');
    await page.fill('input[name="text_input_new_note_title"]', 'a note created by playwright2');
    await page.fill('input[name="text_input_new_note"]', 'note content2');
    await page.click('button[name="text_input_save_new_note"]');
    
    await page.reload();

    // Navigate through multiple pages to find the note
    let found = false;
    while (!found) {
        // Verify if the note is on the current page
        const isNoteVisible = await page.locator('text=a note created by playwright2').first().isVisible();
        if (isNoteVisible) {
            found = true;
            break;
        }

        // Click on the next page button
        const nextPageButton = await page.$('button[name="next"]');
        console.log("nextPageButton:" + nextPageButton)
        if (nextPageButton) {
            await nextPageButton.click();
        } else {
        // Exit the loop if there's no next page button or note found
        break;
        }
    }

    // Assertion to ensure the note was found
    expect(found).toBe(true);
});