import { Injectable } from "@nestjs/common";
import * as puppeteer from 'puppeteer';

@Injectable()
export class UrlService {
  
  public async scrapePage(url: string):  Promise<Record<string, string>> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    const title = await page.title();
    console.info(title);

    const metaInfo = await page.evaluate(() => {
      const metas = document.getElementsByTagName('meta');
      const metaMap: Record<string, string> = {};


      for (let i = 0; i < metas.length; i++) {
        const name = metas[i].getAttribute('name') || metas[i].getAttribute('property');
        const content = metas[i].getAttribute('content');
        if (name && content) {
          metaMap[name] = content;
        }
      }
      return metaMap;
    });
    await browser.close();
    console.info(metaInfo);
    return metaInfo;
  }
}