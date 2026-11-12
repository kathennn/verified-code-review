'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const cli = path.resolve(__dirname, '../bin/verified-code-review.js');

function run(args, cwd, home) {
  return spawnSync(process.execPath, [cli, ...args], {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, HOME: home }
  });
}

test('shows help and version without writing files', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vcr-help-'));
  const home = path.join(root, 'home');
  const help = run(['--help'], root, home);
  const version = run(['--version'], root, home);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Usage:/);
  assert.equal(version.status, 0);
  assert.match(version.stdout, /^0\.1\.0/m);
  assert.equal(fs.existsSync(path.join(root, '.claude')), false);
});

test('dry run reports the project destination without creating it', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vcr-dry-'));
  const result = run(['--dry-run'], root, path.join(root, 'home'));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Dry run/);
  assert.equal(fs.existsSync(path.join(root, '.claude')), false);
});

test('installs the skill into the project directory', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vcr-local-'));
  const result = run([], root, path.join(root, 'home'));
  const installed = path.join(root, '.claude', 'skills', 'verified-code-review', 'SKILL.md');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(installed), true);
  assert.match(fs.readFileSync(installed, 'utf8'), /Verified Code Review/);
});

test('global option installs under the user home directory', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vcr-global-'));
  const home = path.join(root, 'home');
  const result = run(['--global'], root, home);
  const installed = path.join(home, '.claude', 'skills', 'verified-code-review', 'SKILL.md');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(installed), true);
  assert.equal(fs.existsSync(path.join(root, '.claude')), false);
});

test('refuses to overwrite an existing skill directory', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vcr-existing-'));
  const destination = path.join(root, '.claude', 'skills', 'verified-code-review');
  fs.mkdirSync(destination, { recursive: true });
  const existing = path.join(destination, 'SKILL.md');
  fs.writeFileSync(existing, 'user content\n');
  const result = run([], root, path.join(root, 'home'));
  assert.equal(result.status, 1);
  assert.match(result.stderr, /already exists/);
  assert.equal(fs.readFileSync(existing, 'utf8'), 'user content\n');
});

test('rejects unknown options', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'vcr-args-'));
  const result = run(['--overwrite'], root, path.join(root, 'home'));
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unknown option/);
});
