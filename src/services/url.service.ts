import { Injectable } from "@nestjs/common";
import * as puppeteer from 'puppeteer';

@Injectable()
export class UrlService {

  private browser: puppeteer.Browser;
  private page: puppeteer.Page;

  public async scrapePage(url: string): Promise<Record<string, any>> {
    if (!this.browser) {
      this.browser = await puppeteer.launch();
      this.page = await this.browser.newPage();
    }
    await this.page.goto(url, { waitUntil: 'networkidle2' });
    const data = await this.page.evaluate(() => {
      const title = document.querySelector('title')?.textContent || '';
      const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
      const metaTags = Array.from(document.getElementsByTagName('meta')).map(meta => {
        const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv') || '';
        const content = meta.getAttribute('content') || '';
        return { name, content };
      });
      return { title, description, ogImage, metaTags };
    });
    return data;
  }

}