/**
 * Request validation and sanitization middleware
 */

export const validateSignup = (req, res, next) => {
  const { email, password, name, riotGameName, riotTagLine } = req.body || {};

  const errors = [];

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.push('Valid email is required.');
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    errors.push('Password must be at least 8 characters long.');
  }

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Name is required.');
  }

  if (riotGameName && typeof riotGameName !== 'string') {
    errors.push('Invalid Riot Game Name.');
  }

  if (riotTagLine && typeof riotTagLine !== 'string') {
    errors.push('Invalid Riot Tag Line.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitize fields
  req.body.email = email.trim().toLowerCase();
  req.body.name = name.trim();
  if (riotGameName) req.body.riotGameName = riotGameName.trim();
  if (riotTagLine) req.body.riotTagLine = riotTagLine.trim().replace(/^#/, '');

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  const errors = [];

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    errors.push('Valid email is required.');
  }

  if (!password || typeof password !== 'string') {
    errors.push('Password is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors,
    });
  }

  req.body.email = email.trim().toLowerCase();
  next();
};

export const validateRiotIdParams = (req, res, next) => {
  const { gameName, tagLine, name, tag } = req.params;

  const targetName = gameName || name;
  const targetTag = tagLine || tag;

  if (!targetName || !targetTag) {
    return res.status(400).json({
      status: 'error',
      message: 'Both player name and tag line are required.',
    });
  }

  next();
};
