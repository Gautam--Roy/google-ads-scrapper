import puppeteer from "puppeteer";

import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);

  const pageCount = parseInt(url.searchParams.get("pageCount") as string);
  const keywords = url.searchParams.get("keywords");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  let siteDatas: any = [];

  await page.goto(`https://www.google.com/search?q=${keywords}`);
  const siteData = await page.evaluate(() => {
    const sponsoredAds = Array.from(document.querySelectorAll(".sVXRqc"));
    return sponsoredAds.map((el: any) => {
      return { title: el.querySelector("span").innerText, href: el.href };
    });
  });

  siteDatas.push(siteData);

  let searchPage = 1;
  while (searchPage < pageCount) {
    searchPage++;
    let newPage = await page.$(`a[aria-label="Page ${searchPage}"]`);

    if (newPage) {
      await Promise.all([page.waitForNavigation(), newPage.click()]);

      const nextPage = await page.evaluate(() => {
        const sponsoredAds = Array.from(document.querySelectorAll(".sVXRqc"));
        return sponsoredAds.map((el: any) => {
          return { title: el.querySelector("span").innerText, href: el.href };
        });
      });

      siteDatas.push(nextPage);
    }
  }

  await browser.close();

  return NextResponse.json(siteDatas);
}
