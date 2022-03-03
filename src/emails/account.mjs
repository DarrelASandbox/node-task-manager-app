import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.API_KEY_SENDGRID);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'darrelaiscoding@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Appreciate any feedback in regards to the app.`,
    mail_settings: {
      sandbox_mode: {
        enable: process.env.NODE_ENV === 'test',
      },
    },
  });
};

const deleteAccountEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'darrelaiscoding@gmail.com',
    subject: 'Your Task Manager account has been deleted.',
    text: `${name}, it is sad to see you go. Please let us know the reason or what we can do better to improve our service. Thank you.`,
    mail_settings: {
      sandbox_mode: {
        enable: process.env.NODE_ENV === 'test',
      },
    },
  });
};

export { sendWelcomeEmail, deleteAccountEmail };
