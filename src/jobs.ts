import { PrismaClient } from '@prisma/client';
import { getT3TournamentData } from './utils';

const prisma = new PrismaClient();

const saveTournaments = async () => {
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
              tournamentDate: tournament.date,
              signupDisabled: tournament.isDisabled,
              location: tournament.location,
              seats: tournament.seats,
            },
          });
          return;
        }
        await prisma.tournament.create({
          data: {
            t3Id: tournament.tournamentId,
            tournamentDate: tournament.date,
            signupDisabled: tournament.isDisabled,
            location: tournament.location,
            seats: tournament.seats,
          },
        });
      }
    }
  } catch (error) {
    console.log('Error: ', error);
  } finally {
    prisma.$disconnect();
  }
};

saveTournaments();
