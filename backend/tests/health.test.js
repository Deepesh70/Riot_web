process.env.NODE_ENV = 'test';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../index.js';

describe('Server & Health Routes', () => {
  test('GET / returns root API information', async () => {
    const res = await request(app).get('/');
    assert.equal(res.status, 200);
    assert.equal(res.body.name, 'Riot ReImagined API');
    assert.equal(res.body.status, 'online');
  });

  test('GET /api/health responds with structured health metrics', async () => {
    const res = await request(app).get('/api/health');
    // Without active DB during isolated test, status should be 503 (degraded)
    assert.ok(res.status === 200 || res.status === 503);
    assert.ok(res.body.status);
    assert.ok(res.body.services);
    assert.ok(res.body.system);
  });

  test('GET /api/nonexistent returns 404 with structured error response', async () => {
    const res = await request(app).get('/api/nonexistent');
    assert.equal(res.status, 404);
    assert.equal(res.body.status, 'error');
    assert.equal(res.body.statusCode, 404);
  });
});
