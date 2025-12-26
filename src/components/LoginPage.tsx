import { useState, useEffect } from "react";
import { Shield, User, Store, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { authAPI } from "../services/api";
import { validatePasswordStrength } from "../utils/passwordValidator";
import { toast } from "sonner";

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (user: { email: string; role: 'buyer' | 'seller' | 'admin'; name: string }) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [passwordValidation, setPasswordValidation] = useState<any>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Validate password strength on change
  useEffect(() => {
    if (!isLogin && formData.password) {
      const validation = validatePasswordStrength(formData.password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation(null);
    }
  }, [formData.password, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setErrors({ general: 'Please fill in all fields' });
          setIsLoading(false);
          return;
        }

        try {
          const response = await authAPI.login(formData.email, formData.password);
          
          if (response.success && response.data) {
            const user = response.data.user;
            
            // Store user info
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userRole', user.role);
            
            onLogin({
              email: user.email,
              role: user.role,
              name: user.name
            });
            
            toast.success('Login successful!');
            
            // Navigate based on role
            if (user.role === 'seller' || user.role === 'admin') {
              onNavigate('dashboard');
            } else {
              onNavigate('home');
            }
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          setErrors({ general: errorMessage });
          toast.error(errorMessage);
        }
      } else {
        // Register
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          setErrors({ general: 'Please fill in all fields' });
          setIsLoading(false);
          return;
        }

        // Simple password validation - just check minimum length
        if (!formData.password || formData.password.length < 4) {
          setErrors({ password: 'Password must be at least 4 characters long' });
          setIsLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: 'Passwords do not match' });
          setIsLoading(false);
          return;
        }

        try {
          const response = await authAPI.register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: userRole === 'admin' ? 'buyer' : userRole // Don't allow admin registration
          });

          if (response.success && response.data) {
            const user = response.data.user;
            
            // Store user info
            localStorage.setItem('userName', user.name);
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userRole', user.role);
            
            onLogin({
              email: user.email,
              role: user.role,
              name: user.name
            });
            
            toast.success('Registration successful!');
            
            // Navigate based on role
            if (user.role === 'seller' || user.role === 'admin') {
              onNavigate('dashboard');
            } else {
              onNavigate('home');
            }
          }
        } catch (error: any) {
          const errorData = error.response?.data;
          if (errorData?.errors) {
            setErrors({ password: errorData.errors.join(', ') });
          } else {
            setErrors({ general: errorData?.message || error.message || 'Registration failed' });
          }
          toast.error(errorData?.message || 'Registration failed');
        }
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An error occurred' });
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Password reset link sent to your email');
        setShowForgotPassword(false);
        setResetEmail('');
      } else {
        toast.error(data.message || 'Failed to send reset link');
      }
    } catch (error: any) {
      toast.error('Failed to send password reset link');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#003366] to-[#004080] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="absolute top-8 left-8 text-white hover:bg-white hover:bg-opacity-20"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-10 w-10 text-[#00CC99]" />
            <div>
              <span className="text-3xl font-bold text-white">BUYSEWA</span>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-sm text-[#00CC99]">✓ Blockchain Verified</span>
              </div>
            </div>
          </div>
          <p className="text-gray-200">
            {isLogin ? 'Welcome back!' : 'Join Nepal\'s most trusted marketplace'}
          </p>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" onClick={() => setIsLogin(false)}>
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role">I am a:</Label>
                    <RadioGroup
                      value={userRole}
                      onValueChange={(value: 'buyer' | 'seller' | 'admin') => setUserRole(value)}
                      className="grid grid-cols-3 gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer" className="flex items-center space-x-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          <span>Buyer</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seller" id="seller" />
                        <Label htmlFor="seller" className="flex items-center space-x-2 cursor-pointer">
                          <Store className="h-4 w-4" />
                          <span>Seller</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="admin" id="admin" />
                        <Label htmlFor="admin" className="flex items-center space-x-2 cursor-pointer">
                          <Shield className="h-4 w-4" />
                          <span>Admin</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter your password"
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                    )}
                  </div>
                </div>

                {errors.general && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#003366] hover:bg-[#002244] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-[#003366] hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role-signup">I want to:</Label>
                    <RadioGroup
                      value={userRole}
                      onValueChange={(value: 'buyer' | 'seller' | 'admin') => setUserRole(value)}
                      className="grid grid-cols-2 gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer-signup" />
                        <Label htmlFor="buyer-signup" className="flex items-center space-x-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          <span>Buy Products</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="seller" id="seller-signup" />
                        <Label htmlFor="seller-signup" className="flex items-center space-x-2 cursor-pointer">
                          <Store className="h-4 w-4" />
                          <span>Sell Products</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="name">
                      {userRole === 'seller' ? 'Store Name' : 'Full Name'}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder={userRole === 'seller' ? 'Enter your store name' : 'Enter your full name'}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-signup">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email-signup"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password-signup">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password-signup"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a password (min 8 chars, uppercase, lowercase, number, special char)"
                        className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Simple password hint */}
                    {formData.password && formData.password.length < 4 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 4 characters
                      </p>
                    )}
                    
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirm-password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        required
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
                    )}
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>

                {userRole === 'seller' && (
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Seller accounts require verification. You'll receive blockchain credentials after approval.
                    </AlertDescription>
                  </Alert>
                )}

                {errors.general && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-[#FF6600] hover:bg-[#e55a00] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Secure Login</span>
            </div>
            <p className="text-xs text-gray-700">
              Your data is securely encrypted with bcrypt hashing, JWT tokens, and rate limiting protection.
            </p>
          </div>
        </Card>

        {/* Forgot Password Dialog */}
        {showForgotPassword && (
          <Card className="mt-4 p-6">
            <h3 className="text-lg font-semibold mb-4">Reset Password</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleForgotPassword}
                  className="flex-1 bg-[#003366] hover:bg-[#002244] text-white"
                >
                  Send Reset Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}