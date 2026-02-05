#!/usr/bin/env node
/**
 * Fill Shopify App Version Form
 * 
 * This script uses Playwright to navigate to the Shopify Partners dashboard
 * and fill in the app version form for Hydrogen deployment.
 * 
 * Usage:
 *   node scripts/fill-shopify-app-form.mjs
 * 
 * Requirements:
 * - Must be logged into Shopify Partners dashboard
 * - App ID: 319572377601
 * - Store ID: 22991897
 */

import { chromium } from 'playwright';

const APP_VERSION_URL = 'https://dev.shopify.com/dashboard/22991897/apps/319572377601/versions/new';
const APP_ID = '319572377601';
const STORE_ID = '22991897';

console.log('🌐 Opening Shopify Partners Dashboard...\n');

async function fillAppVersionForm() {
  const browser = await chromium.launch({ 
    headless: false, // Show browser so user can see what's happening
    slowMo: 500 // Slow down actions for visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  
  const page = await context.newPage();
  
  try {
    console.log(`📝 Navigating to: ${APP_VERSION_URL}\n`);
    await page.goto(APP_VERSION_URL, { waitUntil: 'networkidle' });
    
    // Wait for page to load
    await page.waitForTimeout(2000);
    
    console.log('🔍 Checking page content...\n');
    
    // Take a screenshot to see what we're working with
    await page.screenshot({ path: 'shopify-app-form.png', fullPage: true });
    console.log('📸 Screenshot saved: shopify-app-form.png\n');
    
    // Look for common form fields
    const pageContent = await page.content();
    const pageTitle = await page.title();
    
    console.log(`Page Title: ${pageTitle}\n`);
    
    // Check if we're on a login page
    if (pageTitle.includes('Login') || page.url().includes('login')) {
      console.log('⚠️  Login page detected!');
      console.log('   Waiting for you to log in manually...');
      console.log('   The browser will stay open. Please log in, then the script will continue.\n');
      
      // Wait for navigation away from login page (user logged in)
      try {
        await page.waitForFunction(
          () => !document.title.includes('Login') && !window.location.href.includes('login'),
          { timeout: 300000 } // Wait up to 5 minutes for login
        );
        console.log('✅ Login detected! Continuing...\n');
        
        // Navigate to the form URL again after login
        await page.goto(APP_VERSION_URL, { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
      } catch (error) {
        console.log('⏱️  Timeout waiting for login. Please log in and navigate to the form manually.\n');
      }
    }
    
    // Common form field selectors for Shopify app version forms
    const formFields = {
      versionName: [
        'input[name="version_name"]',
        'input[name="name"]',
        'input[placeholder*="version"]',
        'input[placeholder*="Version"]',
        '#version_name',
        '[data-testid="version-name"]'
      ],
      description: [
        'textarea[name="description"]',
        'textarea[name="version_description"]',
        'textarea[placeholder*="description"]',
        '#description',
        '[data-testid="description"]'
      ],
      submitButton: [
        'button[type="submit"]',
        'button:has-text("Create")',
        'button:has-text("Save")',
        'button:has-text("Submit")',
        '[data-testid="submit"]'
      ]
    };
    
    console.log('🔍 Looking for form fields...\n');
    
    // Try to find version name field
    let versionNameField = null;
    for (const selector of formFields.versionName) {
      try {
        versionNameField = await page.locator(selector).first();
        if (await versionNameField.isVisible()) {
          console.log(`✅ Found version name field: ${selector}`);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    // Try to find description field
    let descriptionField = null;
    for (const selector of formFields.description) {
      try {
        descriptionField = await page.locator(selector).first();
        if (await descriptionField.isVisible()) {
          console.log(`✅ Found description field: ${selector}`);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    // Fill in the form if fields are found
    if (versionNameField) {
      const versionName = `Hydrogen Storefront v${new Date().toISOString().split('T')[0]}`;
      console.log(`\n📝 Filling version name: ${versionName}`);
      await versionNameField.click(); // Click to focus
      await versionNameField.fill(''); // Clear first
      await versionNameField.fill(versionName);
      await page.waitForTimeout(500);
    }
    
    if (descriptionField) {
      const description = 'Hydrogen storefront deployment for dryeyela-hydrogen repository. Connects GitHub repo Mobo4/dryeyela-hydrogen to store dryeyela-ai.';
      console.log(`📝 Filling description: ${description}`);
      await descriptionField.click(); // Click to focus
      await descriptionField.fill(''); // Clear first
      await descriptionField.fill(description);
      await page.waitForTimeout(500);
    }
    
    // Look for repository/branch fields
    const repoSelectors = [
      'input[name*="repository"]',
      'input[name*="repo"]',
      'input[placeholder*="repository"]',
      'select[name*="repository"]'
    ];
    
    for (const selector of repoSelectors) {
      try {
        const repoField = await page.locator(selector).first();
        if (await repoField.isVisible()) {
          console.log(`📝 Found repository field: ${selector}`);
          await repoField.fill('Mobo4/dryeyela-hydrogen');
          await page.waitForTimeout(500);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    // Look for branch field
    const branchSelectors = [
      'input[name*="branch"]',
      'input[placeholder*="branch"]',
      'select[name*="branch"]'
    ];
    
    for (const selector of branchSelectors) {
      try {
        const branchField = await page.locator(selector).first();
        if (await branchField.isVisible()) {
          console.log(`📝 Found branch field: ${selector}`);
          await branchField.fill('feature/hybrid-data-sync');
          await page.waitForTimeout(500);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    // Look for storefront ID field
    const storefrontSelectors = [
      'input[name*="storefront"]',
      'input[name*="storefront_id"]',
      'input[placeholder*="storefront"]'
    ];
    
    for (const selector of storefrontSelectors) {
      try {
        const sfField = await page.locator(selector).first();
        if (await sfField.isVisible()) {
          console.log(`📝 Found storefront ID field: ${selector}`);
          await sfField.fill('1000013955');
          await page.waitForTimeout(500);
          break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    // Show what fields were found
    console.log('\n📋 Form Status:');
    console.log(`   Version Name Field: ${versionNameField ? '✅ Found' : '❌ Not found'}`);
    console.log(`   Description Field: ${descriptionField ? '✅ Found' : '❌ Not found'}`);
    
    // Don't auto-submit - let user review and submit manually
    console.log('\n✅ Form filled! Please review and submit manually.');
    console.log('   The browser will stay open for 60 seconds for you to review and submit.\n');
    console.log('   Filled values:');
    console.log('   - Version Name: Hydrogen Storefront v' + new Date().toISOString().split('T')[0]);
    console.log('   - Repository: Mobo4/dryeyela-hydrogen');
    console.log('   - Branch: feature/hybrid-data-sync');
    console.log('   - Storefront ID: 1000013955\n');
    
    await page.waitForTimeout(60000); // Wait 60 seconds
    
    await browser.close();
    console.log('✅ Done!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 This might mean:');
    console.log('   - You need to log in first');
    console.log('   - The page structure has changed');
    console.log('   - Network error\n');
    
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log('📸 Error screenshot saved: error-screenshot.png\n');
    
    await browser.close();
  }
}

// Run the script
fillAppVersionForm().catch(console.error);
