# AxigenMail password reset

Using and old version of AxigenMail is not recommended, but if you are using anything before 10.4 which doesn't include an API and you also need some levels of automation, you can use this tool to reset your password when you're away from your protected infrastructure.

## Notes
- This program **IS NOT** guaranteed to work on all AxigenMail versions.
- This program is just a proof of concept and **IS NOT** suitable for production at any level.
- This program is highly fragile and probably needs alterations to work on your instance.
- Nodemailer and ImapFlow are used to communicate with the mail server.
- Puppeteer is used to automate the password change process.
- Everything is logged to the console using winstonjs.
- pm2 is used to keep the process running.

## How does it  work?
When you launch the application, it will listen for new arrivals in the configured mailbox.

When a new email arrives, if the sender is legit and one of the BCCs, it will be parsed and launches a puppeteer instance.

The headless browser will simulate the actions needed to reset the password.

After the password is reset, the browser will be closed and the randomly generated password will be sent to the recipients.

## Installation
Clone the repository, install dependencies using `npm install`. Follow the instructions below, and finally run `npm start`.

## Usage
1. Create an email account with IMAP access.
2. Create an admin account with change password access.
3. Rename `mail.sample.json` to `mail.json` in config directory and fill in the values:
   1. `transport` is used to specify the nodemailer transport.
   2. `addresses` is used to specify the nodemailer mail options.
   3. `imap` is used to specify the imapflow options.
4. Rename `.env.sample` to `.env` in the root directory and fill in the values:
   1. `ADMIN_URL` is used to specify the admin dashboard url.
   2. `MAIL_USER` and `MAIL_PASS` are used to specify the SMTP and IMAP credentials.
   3. `RESET_USER` and `RESET_PASS` are used to specify the admin credentials.
   4. `PASSWORD_LENGTH` is used to specify the length of the random password.
   5. `TZ` changes the default timezone (IANA format).
5. Run the application.
6. If you encounter an issues with the browser, `utils/axigenBrowser.js` is where you should look.

## Structure
The following structure organizes components.

```
├── .env.sample
├── .eslintrc.json
├── .gitignore
├── .vscode
│   ├── launch.json
│   └── settings.json
├── README.md
├── config
│   └── mail.sample.json
├── index.js
├── package-lock.json
├── package.json
└── utils
    ├── axigenBrowser.js
    ├── logger.js
    ├── randomString.js
    ├── reset.js
    └── sendMail.js
```