import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(cors());

app.get('/tournaments', async (req: Request, res: Response) => {
  const tournaments = await prisma.tournament.findMany();
  res.send({ success: true, tournaments });
});

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
