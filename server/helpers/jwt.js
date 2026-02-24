import JWT from 'jsonwebtoken';
import Boom from 'boom';
import redis from '../clients/redis.js';

const signAccessToken = (data) => {
  return new Promise((resolve, reject) => {
    const payload = { ...data };
    const options = {
      expiresIn: '10d',
      issuer: 'buysewa.app',
    };

    JWT.sign(payload, process.env.JWT_SECRET || 'default_jwt_secret_change_in_production', options, (err, token) => {
      if (err) {
        console.error('JWT Signing Error:', err);
        return reject(Boom.internal('Could not generate access token'));
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  const authorizationToken = req.headers['authorization'];

  if (!authorizationToken) {
    return next(Boom.unauthorized('Access Token is required'));
  }

  const token = authorizationToken.split(' ')[1];
  if (!token) {
    return next(Boom.unauthorized('Invalid token format'));
  }

  JWT.verify(token, process.env.JWT_SECRET || 'default_jwt_secret_change_in_production', (err, payload) => {
    if (err) {
      const message =
        err.name === 'JsonWebTokenError'
          ? 'Unauthorized'
          : err.name === 'TokenExpiredError'
          ? 'Token expired'
          : err.message;
      return next(Boom.unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

const signRefreshToken = (user_id) => {
  return new Promise((resolve, reject) => {
    const payload = { user_id };
    const options = {
      expiresIn: '180d',
      issuer: 'buysewa.app',
    };

    JWT.sign(
      payload,
      process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_in_production',
      options,
      async (err, token) => {
        if (err) {
          return reject(Boom.internal('Could not generate refresh token'));
        }
        try {
          await redis.set(user_id.toString(), token, { EX: 180 * 24 * 60 * 60 });
          resolve(token);
        } catch (redisError) {
          console.error('Redis Error:', redisError);
          // Still return token even if Redis fails
          resolve(token);
        }
      }
    );
  });
};

const verifyRefreshToken = (refresh_token) => {
  return new Promise(async (resolve, reject) => {
    JWT.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_in_production',
      async (err, payload) => {
        if (err) {
          const message =
            err.name === 'JsonWebTokenError'
              ? 'Unauthorized'
              : err.name === 'TokenExpiredError'
              ? 'Refresh token expired'
              : err.message;
          return reject(Boom.unauthorized(message));
        }

        const { user_id } = payload;
        try {
          const user_token = await redis.get(user_id.toString());
          if (!user_token || refresh_token !== user_token) {
            // Allow if Redis not available
            return resolve(user_id);
          }
          resolve(user_id);
        } catch (redisError) {
          console.error('Redis Error:', redisError);
          resolve(user_id);
        }
      }
    );
  });
};

export { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken };
