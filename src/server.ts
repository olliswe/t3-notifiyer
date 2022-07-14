import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import * as EmailValidator from 'email-validator';

const prisma = new PrismaClient();

const app = express();
app.use(cors());

app.get('/tournaments', async (req: Request, res: Response) => {
  const tournaments = await prisma.tournament.findMany();
  res.send({ tournaments });
});

app.post('/signup-email', async (req, res) => {
  const email = req.body.email;
  if (!email) {
    res.status(403).send({ error: 'Email must be provided!' });
    return;
  }
  if (!EmailValidator.validate(email)) {
    res.status(403).send({ error: 'Email must be of valid format!' });
    return;
  }
  await prisma.user.create({
    data: {
      email: email,
    },
  });
  res.status(201).send();
});

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
