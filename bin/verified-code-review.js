#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const VERSION = '0.1.0';
const SKILL_RELATIVE_PATH = path.join('skills', 'verified-code-review', 'SKILL.md');

function usage() {
  return [
    'Verified Code Review installer',
    '',
    'Usage:',
    '  npx verified-code-review [options]',
    '',
    'Options:',
    '  --global     Install for the current user in ~/.claude/skills/',
    '  --dry-run    Show the destination without writing files',
    '  --version    Print the version',
    '  --help       Show this help',
    '',
    'By default, installs into .claude/skills/ in the current project.',
    'Existing skill files are never overwritten.'
  ].join('\n');
}

function main(argv = process.argv.slice(2)) {
  let globalInstall = false;
  let dryRun = false;

  for (const arg of argv) {
    if (arg === '--global') globalInstall = true;
    else if (arg === '--dry-run') dryRun = true;
    else if (arg === '--version' || arg === '-v') {
      console.log(VERSION);
      return 0;
    } else if (arg === '--help' || arg === '-h') {
      console.log(usage());
      return 0;
    } else {
      console.error('Unknown option: ' + arg);
      console.error('Run with --help to see available options.');
      return 2;
    }
  }

  const source = path.join(__dirname, '..', SKILL_RELATIVE_PATH);
  const base = globalInstall
    ? path.join(os.homedir(), '.claude', 'skills')
    : path.join(process.cwd(), '.claude', 'skills');
  const destination = path.join(base, 'verified-code-review');
  const targetFile = path.join(destination, 'SKILL.md');

  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
    console.error('Installation failed: bundled SKILL.md is missing.');
    return 1;
  }

  if (fs.existsSync(destination)) {
    console.error('Installation stopped: destination already exists: ' + destination);
    console.error('Nothing was changed. Back up or move that directory yourself before retrying.');
    return 1;
  }

  if (dryRun) {
    console.log('Dry run: no files were changed.');
    console.log('Would install skill to: ' + targetFile);
    return 0;
  }

  try {
    fs.mkdirSync(destination, { recursive: true });
    fs.copyFileSync(source, targetFile, fs.constants.COPYFILE_EXCL);
    console.log('Verified Code Review skill installed successfully.');
    console.log('Location: ' + targetFile);
    console.log('Restart or refresh Claude Code, then invoke the verified-code-review skill.');
    return 0;
  } catch (error) {
    console.error('Installation failed: ' + error.message);
    console.error('If a partial directory was created, inspect it before retrying.');
    return 1;
  }
}

process.exitCode = main();
