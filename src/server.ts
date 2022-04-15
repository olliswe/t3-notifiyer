import express, { Request, Response } from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Tabletojson } from 'tabletojson';
import puppeteer from 'puppeteer'


const launchPuppeteer = async (eventUrl:string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(eventUrl);
  await page.waitForSelector('.title');
  await page.waitForSelector('select[name="playersTable_length"]');
  await page.select('select[name="playersTable_length"]', '-1')
  const names = await page.evaluate(() => Array.from(document?.querySelectorAll('.title')).map((node)=>node.textContent))
  // const data = await page.evaluate(() => document?.querySelector('*')?.outerHTML);
  // await page.screenshot({ path: 'example.png' });
  await browser.close();
  return names
};
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

app.get('/event', async (req: Request, res: Response) =>{
  const eventUrl = req.query.link
  if (typeof  eventUrl === 'string'){
    const names = await launchPuppeteer(eventUrl)
    const parsedNames = names.map((name)=>{
      if(!name){
        return {
          firstName:'',
          lastName:''
        }
      }
      const splitString = name.trim().match(/^(\S+)\s(.*)/)?.slice(1)
      if (splitString){
        return {
          firstName: splitString[0],
          lastName: splitString[1]
        }
      }
      return {
        firstName:'',
        lastName:''
      }
    })
    const withNicknames = await Promise.all(parsedNames.map(async (name)=>{
      const {nickname} = await getT3PlayerData(name)
      return {
        ...name,
        nickname:nickname || 'unknown'
      }
    }))
    res.send({success:true, names:withNicknames});
    return
  }
  res.send({success:false})

})

app.listen(3000, () => {
  console.log('Application started on port 3000!');
});
