import puppeteer from "puppeteer";

import { NextResponse } from "next/server";

export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);

  let pageCount = parseInt(url.searchParams.get("pageCount") as string);
  let keywords = (url.searchParams.get("keywords") as string)?.trim();
  let defaultPageCount = 1;

  console.log(`Pages: ${pageCount}, Keywords: ${keywords}`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: `/usr/bin/google-chrome`,
  });
  const page = await browser.newPage();
  let ads: any = [];

  await page.goto(`https://www.google.com/search?q=${keywords}`);
  const siteData = await page.evaluate(() => {
    const sponsoredAds = Array.from(document.querySelectorAll(".sVXRqc"));
    return sponsoredAds.map((el: any) => {
      return { title: el.querySelector("span").innerText, href: el.href };
    });
  });

  if (siteData.length) ads.push(siteData);

  // Hardcoding pageCount to 3 if it's greater
  if (pageCount > 3) pageCount = 3;
  // Searching other pages.
  while (defaultPageCount <= pageCount) {
    defaultPageCount++;
    let newPage = await page.$(`a[aria-label="Page ${defaultPageCount}"]`);

    if (newPage) {
      await Promise.all([page.waitForNavigation(), newPage.click()]);

      const nextPage = await page.evaluate(() => {
        const sponsoredAds = Array.from(document.querySelectorAll(".sVXRqc"));
        return sponsoredAds.map((el: any) => {
          return { title: el.querySelector("span").innerText, href: el.href };
        });
      });

      ads.push(nextPage);
    }
  }

  await browser.close();

  return NextResponse.json(ads);
}
