/* eslint-disable no-undef */

const puppeteer = require('puppeteer');
const logger = require('./logger');

module.exports = async (options) => {
  try {
    const {
      adminUrl, user, pass, email, newPass,
    } = options;

    const [account, domain] = email.split('@');

    // Open the browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Login to the admin panel
    await page.goto(adminUrl);
    await page.type('input[name="username"]', user);
    await page.type('input[name="password"]', pass);
    await page.click('input[type="submit"]');

    // Go to the user administration page
    const authorizedUrl = page.url();

    // If the provided user is not authorized
    if (authorizedUrl === adminUrl) {
      throw new Error('Invalid credentials');
    }

    // Go to user panel
    await page.goto(`${authorizedUrl}&page=acc&domain_name=${domain}`);
    await page.goto(`${authorizedUrl}&action=edit&page=acced&name=${account}`);

    // If the entered account doesn't exist
    if (await page.evaluate(() => document.querySelector('#permden_title')) !== null) {
      throw new Error('The account does not exist');
    }

    // Enter the new password
    await page.evaluate(() => {
      document.querySelector('input[name="password_input"]').value = '';
    });
    await page.type('input[name="password_input"]', newPass);

    // Save the changes
    await page.click('input[name="update"]');

    // Logout
    await page.goto(`${authorizedUrl}&action=logout`);

    // Close the browser
    await browser.close();

    return true;
  } catch (err) {
    if (err) logger.error(err);
    return false;
  }
};
