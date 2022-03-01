import sgMail from '@sendgrid/mail';
import API_KEY from '../../config.mjs';

const sendgridAPIKey = API_KEY.sendgrid;

sgMail.setApiKey(sendgridAPIKey);

sgMail
  .send({
    to: 'darrelaiscoding@gmail.com',
    from: 'darrelaiscoding@gmail.com',
    subject: 'Email created using Sendgrid API.',
    text: 'Pray...',
  })
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error);
  });
