import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateSignup, validateLogin, validateRiotIdParams } from '../Middleware/validator.js';

describe('Request Validation Middleware', () => {
  test('validateSignup rejects invalid emails and short passwords', () => {
    const req = {
      body: {
        email: 'invalid-email',
        password: '123',
        name: '',
      },
    };
    let statusCode = null;
    let responseBody = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return {
          json: (data) => {
            responseBody = data;
          },
        };
      },
    };
    let nextCalled = false;
    validateSignup(req, res, () => { nextCalled = true; });

    assert.equal(statusCode, 400);
    assert.equal(responseBody.status, 'error');
    assert.ok(responseBody.errors.length >= 3);
    assert.equal(nextCalled, false);
  });

  test('validateSignup sanitizes valid input and calls next', () => {
    const req = {
      body: {
        email: '  User@Example.COM  ',
        password: 'Password123!',
        name: '  GamerTag  ',
        riotGameName: '  TenZ  ',
        riotTagLine: '  #NA1  ',
      },
    };
    const res = {};
    let nextCalled = false;
    validateSignup(req, res, () => { nextCalled = true; });

    assert.equal(nextCalled, true);
    assert.equal(req.body.email, 'user@example.com');
    assert.equal(req.body.name, 'GamerTag');
    assert.equal(req.body.riotGameName, 'TenZ');
    assert.equal(req.body.riotTagLine, 'NA1');
  });

  test('validateLogin rejects missing password', () => {
    const req = {
      body: {
        email: 'user@example.com',
      },
    };
    let statusCode = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: () => {} };
      },
    };
    let nextCalled = false;
    validateLogin(req, res, () => { nextCalled = true; });

    assert.equal(statusCode, 400);
    assert.equal(nextCalled, false);
  });

  test('validateRiotIdParams enforces presence of name and tag', () => {
    const req = { params: { gameName: 'Faker' } };
    let statusCode = null;
    const res = {
      status: (code) => {
        statusCode = code;
        return { json: () => {} };
      },
    };
    let nextCalled = false;
    validateRiotIdParams(req, res, () => { nextCalled = true; });

    assert.equal(statusCode, 400);
    assert.equal(nextCalled, false);
  });
});
