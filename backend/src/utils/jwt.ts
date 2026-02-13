export function generateJWT(payload: Record<string, any>, secret: string, expiresIn: string): string {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyJWT(token: string, secret: string): Record<string, any> {
  const jwt = require('jsonwebtoken');
  return jwt.verify(token, secret);
}

export function decodeJWT(token: string): Record<string, any> {
  const jwt = require('jsonwebtoken');
  return jwt.decode(token);
}
