/**
 * Password Validation Utility
 * Validates password strength and requirements
 */

/**
 * Validate password strength - STRONG REQUIREMENTS
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 number (0-9)
 * - At least 1 special character (!@#$%^&*)
 * - No 3+ repeating characters
 */
function validatePasswordStrength(password) {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9)');
  }
  
  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  // Check for repeating characters (3+)
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain 3 or more repeating characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength: calculatePasswordStrength(password),
    suggestions: generateSuggestions(password)
  };
}

/**
 * Calculate password strength score (0-100)
 */
function calculatePasswordStrength(password) {
  let score = 0;
  
  if (!password) return 0;
  
  // Length score (max 25 points)
  if (password.length >= 8) score += 5;
  if (password.length >= 12) score += 5;
  if (password.length >= 16) score += 5;
  if (password.length >= 20) score += 10;
  
  // Character variety (max 50 points)
  if (/[a-z]/.test(password)) score += 12;
  if (/[A-Z]/.test(password)) score += 12;
  if (/[0-9]/.test(password)) score += 13;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 13;
  
  // Uniqueness bonus (max 25 points)
  const uniqueChars = new Set(password).size;
  const uniqueRatio = uniqueChars / password.length;
  if (uniqueRatio >= 0.5) score += 12;
  if (uniqueRatio >= 0.7) score += 13;
  
  // No repeating characters bonus
  if (!/(.)\1{2,}/.test(password)) score += 5;
  
  return Math.min(100, score);
}

/**
 * Get password strength label with color
 */
function getPasswordStrengthLabel(score) {
  if (score < 30) {
    return { 
      label: 'Weak', 
      color: 'red',
      indicator: '🔴',
      message: 'Password is too weak. Add more variety and length.'
    };
  }
  if (score < 60) {
    return { 
      label: 'Fair', 
      color: 'orange',
      indicator: '🟠',
      message: 'Password is fair. Consider adding more special characters.'
    };
  }
  if (score < 80) {
    return { 
      label: 'Good', 
      color: 'yellow',
      indicator: '🟡',
      message: 'Password is good. Meets security requirements.'
    };
  }
  return { 
    label: 'Strong', 
    color: 'green',
    indicator: '🟢',
    message: 'Password is strong. Excellent choice!'
  };
}

/**
 * Generate password suggestions
 */
function generateSuggestions(password) {
  const suggestions = [];
  
  if (password.length < 12) {
    suggestions.push('Use at least 12 characters for better security');
  }
  
  if (!/[A-Z]/.test(password)) {
    suggestions.push('Add uppercase letters (A-Z)');
  }
  
  if (!/[a-z]/.test(password)) {
    suggestions.push('Add lowercase letters (a-z)');
  }
  
  if (!/[0-9]/.test(password)) {
    suggestions.push('Add numbers (0-9)');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    suggestions.push('Add special characters (!@#$%^&*)');
  }
  
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push('Avoid repeating characters');
  }
  
  return suggestions;
}

/**
 * Check if password was previously used (against common patterns)
 */
function checkCommonPasswords(password) {
  const commonPatterns = [
    'password', 'admin', 'letmein', 'welcome', 'monkey',
    'dragon', 'master', 'sunshine', 'princess', 'qwerty',
    '123456', 'password123', 'admin123'
  ];
  
  const lowerPassword = password.toLowerCase();
  return commonPatterns.some(pattern => lowerPassword.includes(pattern));
}

/**
 * Generate a strong password suggestion
 */
function generateStrongPassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + special;
  let password = '';
  
  // Ensure all character types are included
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  
  // Fill the rest with random characters
  for (let i = password.length; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

module.exports = {
  validatePasswordStrength,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  generateSuggestions,
  checkCommonPasswords,
  generateStrongPassword
};


