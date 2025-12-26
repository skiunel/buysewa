/**
 * Security Middleware
 * Rate limiting, validation, and security headers
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, query, validationResult } = require('express-validator');

// ==================== RATE LIMITING ====================

// Strict rate limiting for login attempts (5 attempts per 15 minutes per IP)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for specific IPs (e.g., your own)
    return process.env.WHITELIST_IPS?.split(',').includes(req.ip);
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again in 15 minutes.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// Strict rate limiting for registration (5 per hour per IP)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many account creation attempts, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many registration attempts. Please try again in 1 hour.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

// General API rate limiting (100 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

// Password reset rate limiting (3 attempts per hour)
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many password reset attempts, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false
});

// ==================== SECURITY HEADERS ====================

// Helmet.js configuration for security headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// ==================== INPUT VALIDATION ====================

// Email validation
const emailValidation = body('email')
  .trim()
  .toLowerCase()
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

// Password validation - STRONG REQUIREMENTS
const passwordValidation = body('password')
  .trim()
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
  .withMessage('Password must contain at least one special character (!@#$%^&*)')
  .not()
  .matches(/(.)\1{2,}/) // No 3+ repeating characters
  .withMessage('Password cannot contain repeating characters');

// Name validation
const nameValidation = body('name')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('Name must be between 2 and 100 characters')
  .matches(/^[a-zA-Z\s'-]+$/)
  .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes');

// Search query validation
const searchValidation = query('search')
  .optional()
  .trim()
  .isLength({ max: 100 })
  .withMessage('Search query too long')
  .escape(); // Escape HTML special characters

// Price validation
const priceValidation = [
  query('minPrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
  query('maxPrice')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Maximum price must be a positive number')
];

// Comment validation
const commentValidation = body('comment')
  .trim()
  .isLength({ min: 5, max: 500 })
  .withMessage('Comment must be between 5 and 500 characters')
  .escape(); // Prevent XSS

// Rating validation
const ratingValidation = body('rating')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be between 1 and 5');

// Amount validation
const amountValidation = body('amount')
  .isInt({ min: 1 })
  .withMessage('Amount must be a positive number');

// ==================== VALIDATION ERROR HANDLER ====================

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// ==================== SECURE COOKIE MIDDLEWARE ====================

const secureCookies = (req, res, next) => {
  // Override res.cookie to add secure flags
  const originalCookie = res.cookie;
  res.cookie = function(name, value, options = {}) {
    return originalCookie.call(this, name, value, {
      ...options,
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only
      sameSite: 'strict' // CSRF protection
    });
  };
  next();
};

// ==================== CORS CONFIGURATION ====================

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

// ==================== SECURITY LOGGING ====================

// Log security events
const securityLogger = (eventType, req, details = {}) => {
  const timestamp = new Date().toISOString();
  const logMessage = {
    timestamp,
    eventType,
    ip: req.ip,
    method: req.method,
    path: req.path,
    userId: req.user?.id || 'unknown',
    ...details
  };
  
  // In production, send to security monitoring service
  console.log(`[SECURITY] ${JSON.stringify(logMessage)}`);
};

// ==================== EXPORTS ====================

module.exports = {
  // Rate limiters
  loginLimiter,
  registerLimiter,
  apiLimiter,
  passwordResetLimiter,
  
  // Security headers
  securityHeaders,
  
  // Input validation
  emailValidation,
  passwordValidation,
  nameValidation,
  searchValidation,
  priceValidation,
  commentValidation,
  ratingValidation,
  amountValidation,
  handleValidationErrors,
  
  // CORS and cookies
  corsOptions,
  secureCookies,
  
  // Logging
  securityLogger
};
