import Boom from 'boom';
import User from '../../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../helpers/jwt.js';
import ValidationSchema from './validations.js';
import redis from '../../clients/redis.js';

const Register = async (req, res, next) => {
  const input = req.body;
  const { error } = ValidationSchema.validate(input);

  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }

  try {
    const isExists = await User.findOne({ email: input.email });

    if (isExists) {
      return next(Boom.conflict('This e-mail already using.'));
    }

    const user = new User(input);
    const data = await user.save();
    const userData = data.toObject();
    delete userData.password;
    delete userData.__v;

    const accessToken = await signAccessToken({
      user_id: user._id,
      role: user.role,
      store: user.store,
    });
    const refreshToken = await signRefreshToken(user._id);

    res.json({ user: userData, accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
};

const Login = async (req, res, next) => {
  const input = req.body;
  const { error } = ValidationSchema.validate(input);

  if (error) {
    return next(Boom.badRequest(error.details[0].message));
  }

  try {
    const user = await User.findOne({ email: input.email }).populate('store');

    if (!user) {
      throw Boom.notFound('The email address was not found.');
    }

    const isMatched = await user.isValidPass(input.password);
    if (!isMatched) {
      throw Boom.unauthorized('email or password not correct');
    }

    const accessToken = await signAccessToken({
      user_id: user._id,
      role: user.role,
      store: user.store?._id || user.store,
    });
    const refreshToken = await signRefreshToken(user._id);
    const userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    res.json({ user: userData, accessToken, refreshToken });
  } catch (e) {
    return next(e);
  }
};

const RefreshToken = async (req, res, next) => {
  const { refresh_token } = req.body;
  try {
    if (!refresh_token) throw Boom.badRequest();

    const user_id = await verifyRefreshToken(refresh_token);
    const accessToken = await signAccessToken(user_id);
    const refreshToken = await signRefreshToken(user_id);

    res.json({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
};

const Logout = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) throw Boom.badRequest();

    const user_id = await verifyRefreshToken(refresh_token);
    await redis.del(user_id.toString());

    res.json({ message: 'success' });
  } catch (e) {
    return next(e);
  }
};

const Me = async (req, res, next) => {
  const { user_id } = req.payload;
  try {
    const user = await User.findById(user_id).select('-password -__v').populate('store');
    res.json(user);
  } catch (e) {
    next(e);
  }
};

export default { Register, Login, RefreshToken, Logout, Me };
