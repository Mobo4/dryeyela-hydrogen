#!/usr/bin/env node

/**
 * Ralph Loop: Monitor GitHub Actions Build Until Success
 * 
 * Continuously checks GitHub Actions workflow status until build succeeds.
 * Uses Ralph loop pattern: verify → iterate → refine → verify again
 * 
 * Usage:
 *   node scripts/ralph-loop-check-build.mjs [--max-attempts 30] [--interval 10]
 */

import { execSync } from 'child_process';

const GITHUB_REPO = 'Mobo4/dryeyela-hydrogen';
const WORKFLOW_FILE = 'oxygen-deployment-1000013955.yml';
const MAX_ATTEMPTS = parseInt(process.env.MAX_ATTEMPTS || process.argv.find(a => a.startsWith('--max-attempts'))?.split('=')[1] || '30');
const INTERVAL_SECONDS = parseInt(process.env.INTERVAL || process.argv.find(a => a.startsWith('--interval'))?.split('=')[1] || '10');

console.log('🔄 Ralph Loop: Monitoring GitHub Actions Build\n');
console.log('=' .repeat(60));
console.log(`Repository: ${GITHUB_REPO}`);
console.log(`Workflow: ${WORKFLOW_FILE}`);
console.log(`Max attempts: ${MAX_ATTEMPTS}`);
console.log(`Check interval: ${INTERVAL_SECONDS} seconds`);
console.log('=' .repeat(60) + '\n');

// Check if GitHub CLI is available
function checkGitHubCLI() {
  try {
    execSync('which gh', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Get latest workflow run using GitHub CLI
function getLatestWorkflowRun() {
  try {
    const output = execSync(
      `gh run list --workflow="${WORKFLOW_FILE}" --repo ${GITHUB_REPO} --limit 1 --json status,conclusion,displayTitle,number,url`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    const runs = JSON.parse(output);
    return runs[0] || null;
  } catch (error) {
    console.error('❌ Error fetching workflow run:', error.message);
    return null;
  }
}

// Get workflow run details
function getWorkflowRunDetails(runId) {
  try {
    // Use the full run ID (databaseId) instead of number
    const output = execSync(
      `gh run view ${runId} --repo ${GITHUB_REPO} --json status,conclusion,displayTitle,url,jobs,databaseId`,
      { encoding: 'utf-8', stdio: 'pipe' }
    );
    return JSON.parse(output);
  } catch (error) {
    // Try using the URL directly if run ID fails
    try {
      const output = execSync(
        `gh api repos/${GITHUB_REPO}/actions/runs/${runId} --jq '{status,conclusion,display_title,html_url,jobs}'`,
        { encoding: 'utf-8', stdio: 'pipe' }
      );
      return JSON.parse(output);
    } catch (err2) {
      console.error('❌ Error fetching workflow details:', error.message);
      return null;
    }
  }
}

// Check deployment job status
function checkDeploymentJob(runDetails) {
  if (!runDetails?.jobs) return null;
  
  const deployJob = runDetails.jobs.find(job => 
    job.name?.includes('Deploy to Oxygen') || 
    job.name?.includes('deploy')
  );
  
  return deployJob || null;
}

// Ralph Loop: Verify → Iterate → Refine
async function ralphLoop() {
  let attempt = 0;
  let lastStatus = null;
  
  console.log('🚀 Starting Ralph Loop...\n');
  
  while (attempt < MAX_ATTEMPTS) {
    attempt++;
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`\n[${timestamp}] Attempt ${attempt}/${MAX_ATTEMPTS}`);
    console.log('─'.repeat(60));
    
    // VERIFY: Check current build status
    console.log('🔍 VERIFY: Checking build status...');
    
    const latestRun = getLatestWorkflowRun();
    
    if (!latestRun) {
      console.log('   ⚠️  No workflow runs found');
      console.log('   💡 Push code to trigger workflow');
      await sleep(INTERVAL_SECONDS * 1000);
      continue;
    }
    
    const { status, conclusion, displayTitle, number, url, databaseId } = latestRun;
    const runId = databaseId || number; // Use databaseId if available, fallback to number
    
    console.log(`   Run #${number} (ID: ${runId}): ${displayTitle || 'Deploy to Oxygen'}`);
    console.log(`   Status: ${status}`);
    console.log(`   Conclusion: ${conclusion || 'pending'}`);
    console.log(`   URL: ${url}`);
    
    // Check if status changed
    if (status !== lastStatus) {
      console.log(`   📊 Status changed: ${lastStatus || 'none'} → ${status}`);
      lastStatus = status;
    }
    
    // REFINE: Analyze status and take action
    if (status === 'completed' && conclusion === 'success') {
      console.log('\n✅ SUCCESS: Build completed successfully!');
      console.log('─'.repeat(60));
      
      // Get deployment details
      const runDetails = getWorkflowRunDetails(runId);
      if (runDetails) {
        const deployJob = checkDeploymentJob(runDetails);
        if (deployJob) {
          console.log('\n📋 Deployment Job Details:');
          console.log(`   Name: ${deployJob.name}`);
          console.log(`   Status: ${deployJob.status}`);
          console.log(`   Conclusion: ${deployJob.conclusion}`);
          
          // Try to get deployment URL
          if (deployJob.steps) {
            const deployStep = deployJob.steps.find(s => 
              s.name?.includes('Deploy') || s.name?.includes('Publish')
            );
            if (deployStep) {
              console.log(`   Step: ${deployStep.name} - ${deployStep.conclusion || deployStep.status}`);
            }
          }
        }
      }
      
      console.log(`\n🎉 Build successful! View details: ${url}\n`);
      process.exit(0);
    }
    
    if (status === 'completed' && conclusion === 'failure') {
      console.log('\n❌ FAILURE: Build failed');
      console.log('─'.repeat(60));
      
      // Get failure details - use the URL to get logs
      console.log('\n📋 Fetching failure details...');
      
      // Get job logs directly
      try {
        const jobsOutput = execSync(
          `gh run view ${url.split('/').pop()} --repo ${GITHUB_REPO} --log-failed`,
          { encoding: 'utf-8', stdio: 'pipe', maxBuffer: 1024 * 1024 * 10 }
        );
        
        // Extract error from logs
        const errorLines = jobsOutput.split('\n').filter(line => 
          line.includes('Error') || 
          line.includes('Failed') || 
          line.includes('❌') ||
          line.includes('exit code 1')
        ).slice(-10); // Last 10 error lines
        
        if (errorLines.length > 0) {
          console.log('\n   Error Summary:');
          errorLines.forEach(line => console.log(`   ${line}`));
        }
      } catch (logError) {
        console.log('   ⚠️  Could not fetch detailed logs');
      }
      
      const runDetails = getWorkflowRunDetails(runId);
      if (runDetails) {
        const deployJob = checkDeploymentJob(runDetails);
        if (deployJob) {
          console.log('\n📋 Failure Details:');
          console.log(`   Job: ${deployJob.name}`);
          console.log(`   Status: ${deployJob.status}`);
          console.log(`   Conclusion: ${deployJob.conclusion}`);
          
          // Show failed steps
          if (deployJob.steps) {
            const failedSteps = deployJob.steps.filter(s => s.conclusion === 'failure');
            if (failedSteps.length > 0) {
              console.log('\n   Failed Steps:');
              failedSteps.forEach(step => {
                console.log(`   - ${step.name}: ${step.conclusion}`);
              });
            }
          }
        }
      }
      
      console.log(`\n🔍 View logs: ${url}`);
      console.log('💡 Common fixes:');
      console.log('   1. Check if OXYGEN_DEPLOYMENT_TOKEN_1000013955 is in GitHub Secrets');
      console.log('   2. Verify token is valid (not expired)');
      console.log('   3. Check build logs for specific errors');
      console.log('   4. Run: node scripts/diagnose-deployment-failure.mjs\n');
      process.exit(1);
    }
    
    if (status === 'in_progress' || status === 'queued') {
      console.log(`   ⏳ Build ${status === 'queued' ? 'queued' : 'in progress'}...`);
      console.log(`   🔄 Waiting ${INTERVAL_SECONDS}s before next check`);
    }
    
    // ITERATE: Wait and check again
    if (attempt < MAX_ATTEMPTS) {
      await sleep(INTERVAL_SECONDS * 1000);
    }
  }
  
  console.log(`\n⏱️  Max attempts reached (${MAX_ATTEMPTS})`);
  console.log('💡 Build may still be running. Check manually:');
  console.log(`   ${latestRun?.url || `https://github.com/${GITHUB_REPO}/actions`}\n`);
  process.exit(2);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
async function main() {
  if (!checkGitHubCLI()) {
    console.error('❌ GitHub CLI (gh) not found!');
    console.error('   Install: brew install gh');
    console.error('   Or: npm install -g @github/cli');
    console.error('\n   Then authenticate: gh auth login\n');
    process.exit(1);
  }
  
  // Check authentication
  try {
    execSync('gh auth status', { stdio: 'pipe' });
  } catch {
    console.error('❌ GitHub CLI not authenticated!');
    console.error('   Run: gh auth login\n');
    process.exit(1);
  }
  
  await ralphLoop();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}
