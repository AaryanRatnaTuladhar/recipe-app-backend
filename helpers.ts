import { sign } from 'hono/jwt';
import { CookieOptions } from 'hono/utils/cookie';

export const generateToken = async(userId) => {
  const secret = process.env.JWT_SECRET;
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userId,
    iat: now,
    exp:now + 1 * 60 * 60,
  };

  const token = await sign(payload, secret!);
  return token;
}

export const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'Lax', // or strict
  path: '/',
  maxAge: 3600,
} as CookieOptions;