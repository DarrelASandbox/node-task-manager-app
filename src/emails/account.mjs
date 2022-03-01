import sgMail from '@sendgrid/mail';
import API_KEY from '../../config.mjs';

const sendgridAPIKey = API_KEY.sendgrid;

sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'darrelaiscoding@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Appreciate any feedback in regards to the app.`,
  });
};

const deleteAccountEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'darrelaiscoding@gmail.com',
    subject: 'Your Task Manager account has been deleted.',
    text: `${name}, it is sad to see you go. Please let us know the reason or what we can do better to improve our service. Thank you.`,
  });
};

export { sendWelcomeEmail, deleteAccountEmail };
