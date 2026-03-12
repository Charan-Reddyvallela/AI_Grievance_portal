import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mui/material/Icon';
import { useAuth } from '../context/AuthContext';
import BasicLayout from 'layouts/authentication/components/BasicLayout';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import MDInput from 'components/MDInput';
import MDButton from 'components/MDButton';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    else if (formData.phone && formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Phone must be at least 10 digits';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    if (result.success) navigate('/dashboard');
    else setErrors((prev) => ({ ...prev, general: result.error || 'Registration failed' }));
  };

  return (
    <BasicLayout>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.9)",
          overflow: "hidden",
        }}
      >
        <MDBox variant="gradient" bgColor="info" borderRadius="lg" coloredShadow="info" mx={2} mt={-3} p={2} mb={1} textAlign="center">
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign up
          </MDTypography>
          <MDTypography variant="body2" color="white" opacity={0.9} mt={1}>
            Create your account to submit and track complaints
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            {errors.general && (
              <MDBox mb={2}>
                <MDTypography variant="caption" color="error">{errors.general}</MDTypography>
              </MDBox>
            )}
            <MDBox mb={2}>
              <MDInput label="Full Name" name="name" value={formData.name} onChange={handleChange} fullWidth error={!!errors.name} helperText={errors.name} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput type="email" label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth error={!!errors.email} helperText={errors.email} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput label="Phone (optional)" name="phone" value={formData.phone} onChange={handleChange} fullWidth error={!!errors.phone} helperText={errors.phone} />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type={showPassword ? 'text' : 'password'}
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Icon>{showPassword ? 'visibility_off' : 'visibility'}</Icon>
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
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        <Icon>{showConfirmPassword ? 'visibility_off' : 'visibility'}</Icon>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1} mb={2}>
              <MDTypography variant="caption" color="text">
                I agree to the <Link to="/terms" style={{ color: 'inherit' }}>Terms</Link> and <Link to="/privacy" style={{ color: 'inherit' }}>Privacy Policy</Link>
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="small" /> : 'Create account'}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{' '}
                <MDTypography component={Link} to="/login" variant="button" color="info" fontWeight="medium" textGradient>
                  Sign in
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}
