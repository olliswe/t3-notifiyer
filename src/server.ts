import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import * as EmailValidator from 'email-validator';
import { sendSignupMail } from './emails';
import bodyParser from 'body-parser';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/tournaments', async (req: Request, res: Response) => {
  const tournaments = await prisma.tournament.findMany({
    where: {
      tournamentDate: {
        gte: new Date().toISOString(),
      },
    },
  });
  const withParsedDate = tournaments.map((t) => ({ ...t, tournamentDate: dayjs(t.tournamentDate).format('DD-MM-YYYY') }));
  res.send({ tournaments: withParsedDate });
});

app.post('/signup-email', async (req, res) => {
  const email = req.body?.email;
  if (!email) {
    res.status(403).send({ error: 'Email muss angegeben werden!' });
    return;
  }
  if (!EmailValidator.validate(email)) {
    res.status(403).send({ error: 'Die Email muss ein gültiges Format haben!' });
    return;
  }
  try {
    await prisma.user.create({
      data: {
        email: email,
      },
    });
    sendSignupMail({ email });
    res.status(201).send({ success: true });
  } catch (e) {
    const msg = (e as any)?.code === 'P2002' ? 'Email ist bereits im System!' : 'Etwas ist schief gelaufen!';
    res.status(500).send({ error: msg, success: false });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Application started on port 3000!');
});
