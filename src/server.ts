import express, { Request, Response } from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Tabletojson } from 'tabletojson';

const app = express();

const getT3PlayerData = async ({ firstName, lastName }: { firstName: string; lastName: string }) => {
  const htmlString = await axios('https://www.tabletopturniere.de/t3_ntr_search.php', {
    data: `action=list&name=${firstName}&lastname=${lastName}&nickname=%25&gid=3&cid=1&list=2&submit=Suchen`,
    method: 'POST',
  });
  const dom = new JSDOM(htmlString.data);
  const resultTable = dom.window.document.querySelector('table[class="std"]')?.outerHTML;
  if (!resultTable || resultTable.includes('No match found...')) {
    return { success: false };
  }
  const table = Tabletojson.convert(resultTable);
  if (table && table.length > 0) {
    const firstEntry = table[0];
    if (firstEntry && firstEntry.length > 0) {
      const result = firstEntry[0];
      const nickname = result?.Nickname;
      if (nickname) {
        return { success: true, nickname };
      }
    }
  }
  return { success: false };
};

app.get('/', async (req: Request, res: Response) => {
  const firstName = req.query.firstName;
  const lastName = req.query.lastName;

  if (typeof firstName === 'string' && typeof lastName === 'string') {
    const { success, nickname } = await getT3PlayerData({ firstName, lastName });
    if (success) {
      res.send(nickname);
      return;
    }
  }
  res.send('Not found!');
});

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
