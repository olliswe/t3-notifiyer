import { Tournament } from '@prisma/client';
import sgMail from '@sendgrid/mail';
import { SENDER_EMAIL } from './constants';
import { CONFIRMATION_EMAIL } from './email-templates/confirmation';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendSignupMail = ({ email }: { email: string }) => {
  const msg = {
    to: email, // Change to your recipient
    from: SENDER_EMAIL, // Change to your verified sender
    subject: 'Wilkommen zum T3-Notifier',
    text: 'Wilkommen zum T3-Notifier!',
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

export const newTournamentPosted = ({ emails, newTournaments }: { emails: string[]; newTournaments: Tournament[] }) => {
  emails.forEach((email) => {
    const msg = {
      to: email, // Change to your recipient
      from: SENDER_EMAIL, // Change to your verified sender
      subject: 'Es gibt neue 40k Turniere auf T3!',
      dynamicTemplateData: {
        tournament: newTournaments.map((t) => ({
          name: t.name,
          date: dayjs(t.tournamentDate).format('DD-MM-YYYY'),
          location: t.location,
          seats: t.seats,
          signup: !t.signupDisabled,
          t3Id: t.t3Id,
        })),
        today: dayjs().format('LL'),
      },
      templateId: 'd-d3b057f81453483eb2c032843fd3ee05',
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
