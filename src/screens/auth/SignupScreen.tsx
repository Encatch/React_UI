import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Typography, Container, Divider, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '../../components/TextInput';
import { Button } from '../../components/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';

type SignupFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
}) as yup.ObjectSchema<SignupFormData>;

const SignupScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log('Signup successful:', userCredential.user);
      navigate('/appointments');
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google signup successful:', result.user);
      navigate('/appointments');
    } catch (error: any) {
      console.error('Google signup error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        bgcolor: '#1976d2', 
        color: 'white', 
        mb: 3, 
        borderRadius: 1,
        textAlign: 'left',
      }}>
        <Typography variant="h6" component="h6" sx={{ pl: 2 }}>
          Sign Up
        </Typography>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <TextInput
          control={control}
          name="name"
          label="Full Name"
        />

        <TextInput
          control={control}
          name="email"
          label="Email"
          type="email"
        />

        <TextInput
          control={control}
          name="password"
          label="Password"
          type="password"
        />

        <TextInput
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
        />

        <Button
          label="Sign Up"
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        />

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          label="Continue with Google"
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignup}
          disabled={isLoading}
        />

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/login')}
              sx={{ cursor: 'pointer' }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupScreen; 