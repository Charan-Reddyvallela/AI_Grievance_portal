import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import BasicLayout from 'layouts/authentication/components/BasicLayout';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import LoadingSpinner from '../components/LoadingSpinner';

const AUTH_TRANSITION_MS = 500;

// Clear SVG icons for auth header: Lock (Sign In) and Person + Plus (Sign Up)
const WHITE = '#ffffff';
const STROKE = 3;
function AuthIllustration({ isSignUp }) {
  return (
    <MDBox display="flex" alignItems="center" justifyContent="center" py={1.5} px={2}>
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        {isSignUp ? (
          /* Sign Up: person with plus – clear user silhouette and plus badge */
          <>
            <circle cx="40" cy="26" r="10" stroke={WHITE} strokeWidth={STROKE} fill="none" />
            <path
              d="M24 70 v-6 c0-10 7-18 16-18s16 8 16 18v6"
              stroke={WHITE}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="58" cy="28" r="8" fill="#1565c0" stroke={WHITE} strokeWidth={2} />
            <path d="M58 24 v8 M54 28 h8" stroke={WHITE} strokeWidth={2} strokeLinecap="round" />
          </>
        ) : (
          /* Sign In: padlock – clear lock body and shackle */
          <>
            <path
              d="M28 38 v-10 a12 12 0 0 1 24 0 v10"
              stroke={WHITE}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
            />
            <rect
              x="26"
              y="38"
              width="28"
              height="24"
              rx="3"
              stroke={WHITE}
              strokeWidth={STROKE}
              fill="none"
            />
            <circle cx="40" cy="48" r="3" fill={WHITE} />
          </>
        )}
      </svg>
    </MDBox>
  );
}

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();

  const initialSignUp = location.pathname === '/register' || new URLSearchParams(location.search).get('mode') === 'signup';
  const [isSignUp, setIsSignUp] = useState(initialSignUp);
  const [isAnimating, setIsAnimating] = useState(false);

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fromRegister = location.pathname === '/register' || new URLSearchParams(location.search).get('mode') === 'signup';
    setIsSignUp(fromRegister);
  }, [location.pathname, location.search]);

  const handleSwitch = (toSignUp) => {
    if (toSignUp === isSignUp || isAnimating) return;
    setIsAnimating(true);
    setIsSignUp(toSignUp);
    setErrors({});
    setTimeout(() => setIsAnimating(false), AUTH_TRANSITION_MS);
  };

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateSignIn = () => {
    const newErrors = {};
    if (!signInData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) newErrors.email = 'Please enter a valid email';
    if (!signInData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUp = () => {
    const newErrors = {};
    if (!signUpData.name.trim()) newErrors.name = 'Name is required';
    else if (signUpData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!signUpData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email)) newErrors.email = 'Please enter a valid email';
    if (signUpData.phone && !/^[\d\s\-+()]+$/.test(signUpData.phone)) newErrors.phone = 'Please enter a valid phone number';
    else if (signUpData.phone && signUpData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Phone must be at least 10 digits';
    if (!signUpData.password) newErrors.password = 'Password is required';
    else if (signUpData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!signUpData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (signUpData.password !== signUpData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSignInSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignIn()) return;
    const result = await login(signInData.email, signInData.password);
    if (result.success) navigate('/dashboard');
    else setErrors((prev) => ({ ...prev, general: result.error || 'Login failed' }));
  };

  const onSignUpSubmit = async (e) => {
    e.preventDefault();
    if (!validateSignUp()) return;
    const { confirmPassword, ...registerData } = signUpData;
    const result = await register(registerData);
    if (result.success) navigate('/dashboard');
    else setErrors((prev) => ({ ...prev, general: result.error || 'Registration failed' }));
  };

  const formTransition = {
    transition: `transform ${AUTH_TRANSITION_MS}ms ease-in-out, opacity ${AUTH_TRANSITION_MS}ms ease-in-out`,
  };

  return (
    <BasicLayout>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.9)',
          overflow: 'hidden',
          maxHeight: 'calc(100vh - 80px)',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={1.5}
          mb={0.5}
          textAlign="center"
          sx={{
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <AuthIllustration isSignUp={isSignUp} />
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            {isSignUp ? 'Sign up' : 'Sign in'}
          </MDTypography>
          <MDTypography variant="body2" color="white" opacity={0.9} mt={1}>
            {isSignUp
              ? 'Create your account to submit and track complaints'
              : 'Enter your email and password to access the portal'}
          </MDTypography>
        </MDBox>

        <MDBox pt={1.5} pb={2} px={{ xs: 2, sm: 3 }} sx={{ overflow: 'auto', flex: '1 1 auto' }}>
          {/* Toggle: Sign In / Sign Up */}
          <MDBox display="flex" justifyContent="center" mb={2}>
            <MDBox
              sx={{
                display: 'inline-flex',
                bgcolor: 'grey.100',
                borderRadius: 3,
                p: 0.5,
              }}
            >
              <MDButton
                variant={!isSignUp ? 'contained' : 'text'}
                color="info"
                size="small"
                onClick={() => handleSwitch(false)}
                disabled={isAnimating}
                sx={{
                  minWidth: 100,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: !isSignUp ? 'none' : 'scale(1.02)' },
                  '&:active': { transform: 'scale(0.98)' },
                }}
              >
                Sign In
              </MDButton>
              <MDButton
                variant={isSignUp ? 'contained' : 'text'}
                color="info"
                size="small"
                onClick={() => handleSwitch(true)}
                disabled={isAnimating}
                sx={{
                  minWidth: 100,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: isSignUp ? 'none' : 'scale(1.02)' },
                  '&:active': { transform: 'scale(0.98)' },
                }}
              >
                Sign Up
              </MDButton>
            </MDBox>
          </MDBox>

          {/* Sliding form container - compact for Sign in, smaller for Sign up */}
          <MDBox
            sx={{
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
              minHeight: isSignUp ? { xs: 340, sm: 400 } : { xs: 280, sm: 320 },
              transition: 'min-height 0.4s ease',
            }}
          >
            {/* Sign In form */}
            <MDBox
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                transform: isSignUp ? 'translateX(-100%)' : 'translateX(0)',
                opacity: isSignUp ? 0 : 1,
                pointerEvents: isSignUp ? 'none' : 'auto',
                ...formTransition,
              }}
            >
              <MDBox component="form" role="form" onSubmit={onSignInSubmit}>
                {errors.general && !isSignUp && (
                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="error">{errors.general}</MDTypography>
                  </MDBox>
                )}
                <MDBox mb={2}>
                  <MDInput
                    type="email"
                    label="Email"
                    name="email"
                    value={signInData.email}
                    onChange={handleSignInChange}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    name="password"
                    value={signInData.password}
                    onChange={handleSignInChange}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label={showPassword ? 'Hide password' : 'Show password'} sx={{ color: 'text.secondary' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </MDBox>
                <MDBox display="flex" alignItems="center" ml={-1}>
                  <Switch id="remember-me" />
                  <MDTypography variant="button" fontWeight="regular" color="text" sx={{ cursor: 'pointer', userSelect: 'none', ml: -1, color: 'text.primary' }}>
                    &nbsp;&nbsp;Remember me
                  </MDTypography>
                </MDBox>
                <MDBox mt={4} mb={1}>
                  <MDButton type="submit" variant="gradient" color="info" fullWidth disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="small" /> : 'Sign in'}
                  </MDButton>
                </MDBox>
                <MDBox mt={3} mb={1} textAlign="center">
                  <MDTypography variant="body2" sx={{ color: 'text.primary' }}>
                    Don&apos;t have an account?{' '}
                    <MDTypography
                      component="button"
                      type="button"
                      variant="body2"
                      color="info"
                      fontWeight="medium"
                      onClick={() => handleSwitch(true)}
                      sx={{ cursor: isAnimating ? 'default' : 'pointer', textDecoration: 'underline', border: 'none', background: 'none' }}
                    >
                      Sign up
                    </MDTypography>
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>

            {/* Sign Up form */}
            <MDBox
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                transform: isSignUp ? 'translateX(0)' : 'translateX(100%)',
                opacity: isSignUp ? 1 : 0,
                pointerEvents: isSignUp ? 'auto' : 'none',
                ...formTransition,
              }}
            >
              <MDBox component="form" role="form" onSubmit={onSignUpSubmit}>
                {errors.general && isSignUp && (
                  <MDBox mb={2}>
                    <MDTypography variant="caption" color="error">{errors.general}</MDTypography>
                  </MDBox>
                )}
                <MDBox mb={2}>
                  <MDInput label="Full Name" name="name" value={signUpData.name} onChange={handleSignUpChange} fullWidth error={!!errors.name} helperText={errors.name} />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput type="email" label="Email" name="email" value={signUpData.email} onChange={handleSignUpChange} fullWidth error={!!errors.email} helperText={errors.email} />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput label="Phone (optional)" name="phone" value={signUpData.phone} onChange={handleSignUpChange} fullWidth error={!!errors.phone} helperText={errors.phone} />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    name="password"
                    value={signUpData.password}
                    onChange={handleSignUpChange}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label={showPassword ? 'Hide password' : 'Show password'} sx={{ color: 'text.secondary' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    name="confirmPassword"
                    value={signUpData.confirmPassword}
                    onChange={handleSignUpChange}
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} sx={{ color: 'text.secondary' }}>
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </MDBox>
                <MDBox mb={2} sx={{ textAlign: 'left' }}>
                  <MDTypography variant="body2" sx={{ color: 'text.primary' }}>
                    I agree to the Terms and Privacy Policy
                  </MDTypography>
                </MDBox>
                <MDBox mt={3} mb={1}>
                  <MDButton type="submit" variant="gradient" color="info" fullWidth disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="small" /> : 'Sign up'}
                  </MDButton>
                </MDBox>
                <MDBox mt={3} mb={1} textAlign="center">
                  <MDTypography variant="body2" sx={{ color: 'text.primary' }}>
                    Already have an account?{' '}
                    <MDTypography
                      component="button"
                      type="button"
                      variant="body2"
                      color="info"
                      fontWeight="medium"
                      onClick={() => handleSwitch(false)}
                      sx={{ cursor: isAnimating ? 'default' : 'pointer', textDecoration: 'underline', border: 'none', background: 'none' }}
                    >
                      Sign in
                    </MDTypography>
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          </MDBox>

        </MDBox>
      </Card>
    </BasicLayout>
  );
}
