require('dotenv').config();
const { ImapFlow } = require('imapflow');
const logger = require('./utils/logger');
const config = require('./config/mail.json');
const reset = require('./utils/reset');

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

  if (message
    && config.addresses.bcc.includes(message.envelope.from[0].address)) {
    reset(message.envelope.subject.trim());
  } else {
    logger.info('Invalid message received.');
  }
});

runner().catch((err) => logger.error(err));
