import puppeteer from 'puppeteer';

export const visitjnDev = async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.jonasnilsson.dev/');
    const projects = '.project__wrap';
    await page.waitForSelector(projects);
    await browser.close();
}