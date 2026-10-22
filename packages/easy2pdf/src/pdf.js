import { launch } from 'puppeteer';

/**
 * Build a PDF file from HTML content
 * @param {string} content Properly structured HTML content
 * @param {import('puppeteer').PDFOptions} options PDF page options
 * @returns Buffer of PDF file to be saved
 */
const buildPDF = async (content, options = {}) => {
  const browser = await launch({
    handleSIGHUP: true,
    handleSIGINT: true,
    handleSIGTERM: true
  });
  const page = await browser.newPage();

  await page.setContent(content);
  await page.waitForNetworkIdle();
  const buffer = await page.pdf({
    displayHeaderFooter: false,
    format: 'A4',
    preferCSSPageSize: false,
    ...options
  });

  await page.close();
  await browser.close();

  return buffer;
};

export default buildPDF;
