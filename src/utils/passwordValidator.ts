/**
 * Password Validation Utility (Frontend)
 * Validates password strength and requirements
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: number;
  strengthLabel: string;
  strengthColor: string;
}

/**
 * Validate password strength - SIMPLIFIED
 * Just requires minimum 4 characters
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  if (!password || password.length < 4) {
    errors.push('Password must be at least 4 characters long');
  }
  
  const strength = calculatePasswordStrength(password);
  const { label, color } = getPasswordStrengthLabel(strength);
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
    strengthLabel: label,
    strengthColor: color
  };
}

/**
 * Calculate password strength score (0-100)
 */
function calculatePasswordStrength(password: string): number {
  let score = 0;
  
  if (!password) return 0;
  
  // Length score (max 40 points)
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 10;
  
  // Character variety (max 40 points)
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 10;
  
  // Complexity bonus (max 20 points)
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.5) score += 10;
  if (uniqueChars >= password.length * 0.7) score += 10;
  
  return Math.min(100, score);
}

/**
 * Get password strength label
 */
function getPasswordStrengthLabel(score: number): { label: string; color: string } {
  if (score < 30) return { label: 'Weak', color: 'red' };
  if (score < 60) return { label: 'Fair', color: 'orange' };
  if (score < 80) return { label: 'Good', color: 'yellow' };
  return { label: 'Strong', color: 'green' };
}

