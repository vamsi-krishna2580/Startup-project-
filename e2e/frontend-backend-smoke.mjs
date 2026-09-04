import path from 'node:path';
import process from 'node:process';
import { stat } from 'node:fs/promises';
import { chromium } from 'playwright-core';

const chromePath = process.env.CHROME_PATH
  || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotPath = process.env.E2E_SCREENSHOT
  || path.resolve('e2e', 'frontend-backend-smoke.png');
const pdfPath = process.env.E2E_PDF
  || path.resolve('e2e', 'startup-validation-report.pdf');

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(message.text());
  });

  await page.addInitScript(() => {
    localStorage.setItem('ai_startup_validator_api_url', 'http://127.0.0.1:8000');
    localStorage.setItem('ai_startup_validator_api_mode', 'api');
  });

  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle' });
  await page.locator('#btn-hero-primary-cta').click();
  await page.locator('#analyze-page-container').waitFor();
  await page.locator('#btn-load-healthtech-example').click();
  await page.locator('#input-startup-idea').fill(
    'An AI-powered customer support quality auditor that identifies coaching opportunities for growing SaaS companies.',
  );

  const analysisResponsePromise = page.waitForResponse(
    (response) => response.url().endsWith('/api/startup/analyze')
      && response.request().method() === 'POST',
    { timeout: 180000 },
  );
  await page.locator('#btn-submit-analyze-startup').click();
  const analysisResponse = await analysisResponsePromise;
  const report = await analysisResponse.json();

  if (analysisResponse.status() !== 200) {
    throw new Error(`Analysis API returned ${analysisResponse.status()}: ${JSON.stringify(report)}`);
  }

  const requiredSections = [
    'startup_analysis',
    'market_research',
    'business_strategy',
    'financial_plan',
    'investment_report',
  ];
  if (!requiredSections.every((key) => report[key])) {
    throw new Error(`Analysis response is missing required sections: ${JSON.stringify(report)}`);
  }

  await page.locator('#results-dashboard-container').waitFor({ timeout: 15000 });
  await page.getByText(/Score:\s*\d+\/100/).first().waitFor();
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const storedHistory = await page.evaluate(() => JSON.parse(
    localStorage.getItem('ai_startup_validator_history') || '[]',
  ));
  if (!Array.isArray(storedHistory) || storedHistory.length < 1) {
    throw new Error('Completed analysis was not saved to browser History.');
  }

  await page.locator('#nav-link-history').click();
  await page.locator('#history-page-container').waitFor();
  const historyRows = page.locator('[id^="btn-view-history-"]');
  const historyCount = await historyRows.count();
  if (historyCount < 1) throw new Error('History page did not render the saved report.');
  await historyRows.first().click();
  await page.locator('#results-dashboard-container').waitFor();

  await page.locator('#btn-sidebar-export-report').click();
  await page.locator('#pdf-export-modal').waitFor();
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  await page.locator('#btn-print-executive-pdf').click();
  const download = await downloadPromise;
  await download.saveAs(pdfPath);
  const pdfStats = await stat(pdfPath);
  if (pdfStats.size < 5000) {
    throw new Error(`Generated PDF is unexpectedly small (${pdfStats.size} bytes).`);
  }

  if (browserErrors.length) {
    throw new Error(`Browser console errors: ${browserErrors.join(' | ')}`);
  }

  console.log(JSON.stringify({
    frontend: 'rendered',
    apiStatus: analysisResponse.status(),
    reportId: report.id,
    source: report.source,
    opportunityScore: report.startup_analysis.opportunity_score,
    investmentScore: report.investment_report.investment_readiness_score,
    historyCount,
    pdfBytes: pdfStats.size,
    pdf: pdfPath,
    screenshot: screenshotPath,
  }, null, 2));
} finally {
  await browser.close();
}
