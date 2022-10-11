import { PrismaClient } from '@prisma/client';
import { getT3TournamentData } from '../utils';
import { newTournamentPosted } from '../emails';

const prisma = new PrismaClient();

const getUserEmails = async () => {
  const users = await prisma.user.findMany();
  return users.map((u) => u.email);
};

const saveTournaments = async () => {
  const newTournaments = [];
  try {
    const { data, success } = await getT3TournamentData();
    if (success && data) {
      for (const tournament of data) {
        const existingTournament = await prisma.tournament.findUnique({
          where: {
            t3Id: tournament.tournamentId,
          },
        });
        if (existingTournament) {
          await prisma.tournament.update({
            where: {
              id: existingTournament.id,
            },
            data: {
              name: tournament.name,
              tournamentDate: new Date(tournament.date).toISOString(),
              signupDisabled: tournament.isDisabled,
              location: tournament.location,
              seats: tournament.seats,
            },
          });
        } else {
          const newTournament = await prisma.tournament.create({
            data: {
              name: tournament.name,
              t3Id: tournament.tournamentId,
              tournamentDate: new Date(tournament.date).toISOString(),
              signupDisabled: tournament.isDisabled,
              location: tournament.location,
              seats: tournament.seats,
            },
          });
          newTournaments.push(newTournament);
        }
      }
    }
    if (newTournaments.length > 0) {
      const emails = await getUserEmails();
      newTournamentPosted({ emails, newTournaments });
    }
  } catch (error) {
    console.log('Error: ', error);
  } finally {
    prisma.$disconnect();
  }
};

saveTournaments();
