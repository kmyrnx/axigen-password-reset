require('dotenv').config();
const { ImapFlow } = require('imapflow');
const logger = require('./utils/logger');
const reset = require('./utils/reset');
const validator = require('./utils/validator');
const config = require('./config/mail.json');

const { MAIL_USER, MAIL_PASS } = process.env;

logger.info('Application started');

const client = new ImapFlow({
  ...config.imap,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
  logger,
});

const runner = async () => {
  await client.connect();
  await client.getMailboxLock('INBOX');
};

client.on('exists', async () => {
  const message = await client.fetchOne(client.mailbox.exists, { source: true, envelope: true });

  await client.messageFlagsAdd({ seen: false }, ['\\Seen']);
  const sender = message.envelope.from[0].address;
  const subject = message.envelope.subject.trim();

  if (message
    && validator(sender)
    && validator(subject)
    && config.addresses.bcc.includes(sender)) {
    reset(subject);
  } else {
    logger.info('Invalid message received.');
  }
});

runner().catch((err) => logger.error(err));
