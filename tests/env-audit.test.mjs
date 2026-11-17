import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const SENSITIVE_KEYWORDS = [
  'SUPABASE_SERVICE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SESSION_SECRET',
  'GOOGLE_CLIENT_SECRET',
  'DATABASE_URL',
  'JWT_SECRET',
  'SERVICE_ROLE',
  'SECRET_KEY',
  'POSTGRES_PASSWORD',
];

const ALLOWED_NEXT_PUBLIC_KEYS = new Set([
  'NEXT_PUBLIC_API_URL',
  'NEXT_PUBLIC_TOMTOM_API_KEY',
  'NEXT_PUBLIC_HERE_API_KEY',
  'NEXT_PUBLIC_ROUTING_PROVIDER_ORDER',
]);

function getAllFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx']) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'out', 'android'].includes(entry.name)) continue;
      files = files.concat(getAllFiles(fullPath, exts));
    } else if (entry.isFile() && exts.some(ext => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  return files;
}

test('Security Audit: No server-side secrets prefixed with NEXT_PUBLIC_', () => {
  const envFiles = ['.env', '.env.local', '.env.example', '.env.production'];
  for (const file of envFiles) {
    const filePath = path.join(projectRoot, file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key] = trimmed.split('=');
      const cleanKey = key.trim();

      if (cleanKey.startsWith('NEXT_PUBLIC_')) {
        for (const secret of SENSITIVE_KEYWORDS) {
          assert.equal(
            cleanKey.includes(secret),
            false,
            `CRITICAL: Sensitive variable "${cleanKey}" must never be exposed with NEXT_PUBLIC_ in ${file}!`
          );
        }
      }
    }
  }
});

test('Security Audit: Source code only accesses authorized NEXT_PUBLIC_ variables', () => {
  const sourceDirs = ['app', 'components', 'lib', 'hooks'];
  let allSourceFiles = [];
  for (const dir of sourceDirs) {
    allSourceFiles = allSourceFiles.concat(getAllFiles(path.join(projectRoot, dir)));
  }

  const nextPublicRegex = /process\.env\.(NEXT_PUBLIC_[A-Z0-9_]+)/g;
  const leakedVars = new Set();

  for (const file of allSourceFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    while ((match = nextPublicRegex.exec(content)) !== null) {
      const varName = match[1];
      if (!ALLOWED_NEXT_PUBLIC_KEYS.has(varName)) {
        leakedVars.add(`${varName} in ${path.relative(projectRoot, file)}`);
      }
    }
  }

  assert.equal(
    leakedVars.size,
    0,
    `Unauthorized NEXT_PUBLIC environment variable found in frontend code: ${Array.from(leakedVars).join(', ')}`
  );
});

test('Security Audit: No raw live secrets committed in .env.example', () => {
  const examplePath = path.join(projectRoot, '.env.example');
  if (fs.existsSync(examplePath)) {
    const content = fs.readFileSync(examplePath, 'utf-8');
    // Check for high-entropy supabase service role tokens (eyJ...)
    assert.equal(
      /eyJ[a-zA-Z0-9_-]{20,}\.eyJ[a-zA-Z0-9_-]{20,}/.test(content),
      false,
      'Live JWT token found in .env.example! Replace with dummy placeholder.'
    );
    // Check for raw Postgres connection passwords
    assert.equal(
      /postgres:\/\/.*:.*@/.test(content),
      false,
      'Live database connection string found in .env.example!'
    );
  }
});
