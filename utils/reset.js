const axigenBrowser = require('./axigenBrowser');
const sendMail = require('./sendMail');
const randomString = require('./randomString');
const logger = require('./logger');
const config = require('../config/mail.json');

const {
  RESET_USER, RESET_PASS, MAIL_USER, MAIL_PASS,
  PASSWORD_LENGTH, ADMIN_URL,
} = process.env;

module.exports = async (email) => {
  try {
    const newPass = randomString(PASSWORD_LENGTH);

    const browser = await axigenBrowser({
      adminUrl: ADMIN_URL,
      user: RESET_USER,
      pass: RESET_PASS,
      email,
      newPass,
    });

    const options = {};

    options.transport = {
      ...config.transport,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    };

    options.mail = { ...config.addresses };

    if (!browser) {
      options.mail.subject = 'Reset failed';
    } else {
      options.mail.subject = 'Reset succeeded';
      options.mail.text = newPass;

      logger.info('User reset succesfully');
    }

    await sendMail(options);
  } catch (err) {
    if (err) logger.error(err);
  }
};
