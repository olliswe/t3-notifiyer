import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Tabletojson } from 'tabletojson';

const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, '');

interface TournamentData {
  Date: string;
  Tournament: string;
  Location: string;
  Seats: string;
}

const isTournament = (entry: TournamentData | unknown): entry is TournamentData => !!(entry as TournamentData).Tournament;

export const getT3TournamentData = async () => {
  const htmlString = await axios('https://www.tabletopturniere.de/overview', {
    data: 'name=&city=&month=0&distance=&gid=3&seats-min=&seats-max=&type=0&search=',
    method: 'POST',
  });
  const dom = new JSDOM(htmlString.data);
  const resultTable = dom.window.document.querySelectorAll('table[class="std"]')[1].outerHTML;
  if (!resultTable || resultTable.includes('No match found...')) {
    return { success: false };
  }
  const table = Tabletojson.convert(resultTable, { stripHtmlFromCells: false });

  if (table && table.length > 0) {
    const results: (TournamentData | unknown)[] = table[0];
    const parsedTable = await Promise.all(
      results.filter(isTournament).map(async (entry) => {
        const tournamentATag = new JSDOM(entry.Tournament);
        const href = tournamentATag.window.document.querySelector('a')?.getAttribute('href') || '';
        const tournamentPage = await axios(`https://www.tabletopturniere.de${href}`, {
          method: 'GET',
        });
        const tournamentPageDom = new JSDOM(tournamentPage.data);
        const isDisabled = !!tournamentPageDom.window.document.querySelector('button.disabled');
        const tournamentId = href?.replace('/t3_tournament.php?tid=', '');
        return {
          date: stripHtml(entry.Date),
          tournament: stripHtml(entry.Tournament),
          tournamentId,
          isDisabled,
          location: stripHtml(entry.Location),
          seats: stripHtml(entry.Seats),
        };
      })
    );
    return { success: true, data: parsedTable };
  }
  return { success: false };
};
