import { getT3TournamentData } from './utils';
jest.setTimeout(30000);

describe('test', () => {
  it('fetches data from t3', async () => {
    const table = await getT3TournamentData();
    console.log(table);
    expect(table).toBeDefined();
  });
});
