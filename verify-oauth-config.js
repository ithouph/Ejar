#!/usr/bin/env node

/**
 * OAuth Configuration Verification Script
 * 
 * This script checks your local Ejar configuration to ensure
 * everything is set up correctly for Google OAuth.
 * 
 * It CANNOT check Google Cloud Console or Supabase (requires login),
 * but it will verify all code-level configuration.
 */

import fs from 'fs';
import path from 'path';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[36m';
const RESET = '\x1b[0m';

console.log(`\n${BLUE}═══════════════════════════════════════════════════════════════${RESET}`);
console.log(`${BLUE}   🔐 Ejar OAuth Configuration Verification${RESET}`);
console.log(`${BLUE}═══════════════════════════════════════════════════════════════${RESET}\n`);

let passCount = 0;
let failCount = 0;
let warnCount = 0;

function checkPass(message) {
  console.log(`${GREEN}✓${RESET} ${message}`);
  passCount++;
}

function checkFail(message) {
  console.log(`${RED}✗${RESET} ${message}`);
  failCount++;
}

function checkWarn(message) {
  console.log(`${YELLOW}⚠${RESET} ${message}`);
  warnCount++;
}

function section(title) {
  console.log(`\n${BLUE}${title}${RESET}`);
  console.log(`${'─'.repeat(60)}`);
}

// Check 1: app.json
section('1. Checking app.json');
try {
  const appJson = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  
  const iosBundleId = appJson.expo?.ios?.bundleIdentifier;
  const androidPackage = appJson.expo?.android?.package;
  const scheme = appJson.expo?.scheme;
  
  if (iosBundleId === 'com.ejar.app') {
    checkPass(`iOS Bundle ID: ${iosBundleId}`);
  } else {
    checkFail(`iOS Bundle ID is "${iosBundleId}" (should be "com.ejar.app")`);
  }
  
  if (androidPackage === 'com.ejar.app') {
    checkPass(`Android Package: ${androidPackage}`);
  } else {
    checkFail(`Android Package is "${androidPackage}" (should be "com.ejar.app")`);
  }
  
  if (scheme === 'com.ejar.app') {
    checkPass(`URL Scheme: ${scheme}`);
  } else {
    checkFail(`URL Scheme is "${scheme}" (should be "com.ejar.app")`);
  }
} catch (error) {
  checkFail(`Could not read app.json: ${error.message}`);
}

// Check 2: authService.js
section('2. Checking services/authService.js');
try {
  const authService = fs.readFileSync('services/authService.js', 'utf8');
  
  if (authService.includes("scheme: 'com.ejar.app'")) {
    checkPass('Redirect URI scheme: com.ejar.app');
  } else if (authService.includes("scheme: 'com.travelstay.app'")) {
    checkFail('Still using old scheme "com.travelstay.app"');
  } else {
    checkWarn('Could not verify redirect URI scheme');
  }
  
  if (authService.includes("path: 'auth/callback'")) {
    checkPass('Redirect URI path: auth/callback');
  } else {
    checkWarn('Could not verify redirect URI path');
  }
  
  if (authService.includes('expo-web-browser')) {
    checkPass('expo-web-browser imported');
  } else {
    checkFail('expo-web-browser not imported');
  }
  
  if (authService.includes('signInWithOAuth')) {
    checkPass('Supabase OAuth method used');
  } else {
    checkFail('Supabase OAuth method not found');
  }
} catch (error) {
  checkFail(`Could not read authService.js: ${error.message}`);
}

// Check 3: Environment Variables
section('3. Checking Environment Variables');
try {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
    checkPass('EXPO_PUBLIC_SUPABASE_URL is set');
  } else {
    checkFail('EXPO_PUBLIC_SUPABASE_URL is missing or invalid');
  }
  
  if (supabaseKey && supabaseKey.length > 50) {
    checkPass('EXPO_PUBLIC_SUPABASE_ANON_KEY is set');
  } else {
    checkFail('EXPO_PUBLIC_SUPABASE_ANON_KEY is missing or invalid');
  }
} catch (error) {
  checkWarn(`Could not verify env vars: ${error.message}`);
}

// Check 4: Package dependencies
section('4. Checking Dependencies');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (deps['@supabase/supabase-js']) {
    checkPass('@supabase/supabase-js installed');
  } else {
    checkFail('@supabase/supabase-js not installed');
  }
  
  if (deps['expo-auth-session']) {
    checkPass('expo-auth-session installed');
  } else {
    checkFail('expo-auth-session not installed');
  }
  
  if (deps['expo-web-browser']) {
    checkPass('expo-web-browser installed');
  } else {
    checkFail('expo-web-browser not installed');
  }
} catch (error) {
  checkWarn(`Could not check dependencies: ${error.message}`);
}

// Check 5: Login page
section('5. Checking pages/Login.js');
try {
  const loginPage = fs.readFileSync('pages/Login.js', 'utf8');
  
  if (loginPage.includes('signInWithGoogle')) {
    checkPass('Google sign-in handler present');
  } else {
    checkFail('Google sign-in handler missing');
  }
  
  if (loginPage.includes('Sign up with Google')) {
    checkPass('Google sign-up button text found');
  } else {
    checkWarn('Google sign-up button text not found (might use different text)');
  }
  
  if (loginPage.includes('useAuth')) {
    checkPass('AuthContext hook used');
  } else {
    checkFail('AuthContext hook not imported');
  }
} catch (error) {
  checkWarn(`Could not check Login.js: ${error.message}`);
}

// Summary
console.log(`\n${BLUE}═══════════════════════════════════════════════════════════════${RESET}`);
console.log(`${BLUE}   Summary${RESET}`);
console.log(`${BLUE}═══════════════════════════════════════════════════════════════${RESET}\n`);

console.log(`${GREEN}✓ Passed:${RESET} ${passCount}`);
console.log(`${RED}✗ Failed:${RESET} ${failCount}`);
console.log(`${YELLOW}⚠ Warnings:${RESET} ${warnCount}\n`);

if (failCount === 0) {
  console.log(`${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${GREEN}✅ All local configuration checks passed!${RESET}\n`);
  console.log(`${BLUE}Next Steps:${RESET}`);
  console.log(`1. Set up OAuth clients in Google Cloud Console`);
  console.log(`2. Configure Client IDs and redirect URI in Supabase`);
  console.log(`3. Test on your device with Expo Go\n`);
  console.log(`${BLUE}📖 See SETUP_OAUTH_GUIDE.md for detailed instructions${RESET}\n`);
  console.log(`${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
  process.exit(0);
} else {
  console.log(`${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
  console.log(`${RED}❌ Some configuration issues found${RESET}\n`);
  console.log(`${BLUE}Please fix the failed checks above before proceeding.${RESET}\n`);
  console.log(`${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}\n`);
  process.exit(1);
}
