const mailer = require('nodemailer');

module.exports = async (options) => {
  const transporter = mailer.createTransport(options.transport);

  return transporter
    .sendMail(options.mail)
    .then((d) => d.accepted);
};
