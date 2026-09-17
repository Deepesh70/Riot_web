import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', '..');

describe('Frontend Architecture & Asset Integrity', () => {
  test('index.html exists and contains root mount element', () => {
    const indexPath = path.join(rootDir, 'index.html');
    assert.ok(fs.existsSync(indexPath), 'index.html should exist');
    const content = fs.readFileSync(indexPath, 'utf-8');
    assert.ok(content.includes('id="root"'), 'index.html must contain #root mount div');
  });

  test('vite.config.cjs exists and configures react plugin', () => {
    const viteConfigPath = path.join(rootDir, 'vite.config.cjs');
    assert.ok(fs.existsSync(viteConfigPath), 'vite.config.cjs should exist');
    const content = fs.readFileSync(viteConfigPath, 'utf-8');
    assert.ok(content.includes('@vitejs/plugin-react'), 'Vite config must include react plugin');
  });

  test('main component files and pages exist', () => {
    const requiredFiles = [
      'src/App.jsx',
      'src/main.jsx',
      'src/index.css',
      'src/pages/Home.jsx',
      'src/pages/Games.jsx',
      'src/pages/ValorantPage.jsx',
      'src/pages/PlayerStats.jsx',
      'src/pages/SmurfDetector.jsx',
    ];

    for (const relPath of requiredFiles) {
      const fullPath = path.join(rootDir, relPath);
      assert.ok(fs.existsSync(fullPath), `Required component/page missing: ${relPath}`);
    }
  });

  test('agent dataset json files are valid and parseable', () => {
    const agentMapPath = path.join(rootDir, 'agentMap.json');
    if (fs.existsSync(agentMapPath)) {
      const content = fs.readFileSync(agentMapPath, 'utf-8');
      const parsed = JSON.parse(content);
      assert.ok(typeof parsed === 'object' && parsed !== null, 'agentMap.json must be valid JSON');
    }
  });
});
