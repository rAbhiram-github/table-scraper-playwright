const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting table scraper...');
  
  const browser = await chromium.launch({ 
    headless: true,  // No visible browser window
    slowMo: 100      // Slow down for stability
  });
  
  const page = await browser.newPage();
  let grandTotal = 0;

  // All 10 seed URLs
  const seeds = [80, 81, 82, 83, 84, 85, 86, 87, 88, 89];
  
  for (const seed of seeds) {
    console.log(`\n📊 Processing seed ${seed}...`);
    
    // Visit the page
    await page.goto(`https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`, {
      waitUntil: 'networkidle'  // Wait for all JS to load
    });
    
    // Wait extra for dynamic tables
    await page.waitForSelector('table', { timeout: 10000 });
    
    // Extract ALL numbers from ALL table cells
    const numbers = await page.evaluate(() => {
      const cells = document.querySelectorAll('table td, table th');
      return Array.from(cells)
        .map(cell => {
          const text = cell.textContent.trim();
          const num = parseFloat(text);
          return isNaN(num) ? 0 : num;  // Convert to number or 0
        })
        .filter(num => num !== 0);  // Remove zeros/spacers
    });
    
    const seedSum = numbers.reduce((a, b) => a + b, 0);
    console.log(`✅ Seed ${seed}: Found ${numbers.length} numbers, sum = ${seedSum.toFixed(2)}`);
    grandTotal += seedSum;
  }
  
  console.log(`\n🎉 GRAND TOTAL SUM: ${grandTotal.toFixed(2)}`);
  console.log(`📈 Processed ${seeds.length} pages successfully!`);
  
  await browser.close();
})();
