import sgMail from '@sendgrid/mail';
import { SENDER_EMAIL } from './constants';
import { CONFIRMATION_EMAIL } from './email-templates/confirmation';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendSignupMail = ({ email }: { email: string }) => {
  const msg = {
    to: email, // Change to your recipient
    from: SENDER_EMAIL, // Change to your verified sender
    subject: 'Welcome to T3 Notifier',
    text: 'Welcome!!',
    html: CONFIRMATION_EMAIL,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

export const newTournamentPosted = ({ emails, t3Ids }: { emails: string[]; t3Ids: string[] }) => {
  emails.forEach((email) => {
    const msg = {
      to: email, // Change to your recipient
      from: SENDER_EMAIL, // Change to your verified sender
      subject: 'New Tournaments posted',
      text: t3Ids.join(','),
      html: t3Ids.join(','),
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
  });
};
