import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  // register API call
  const register = async (name, email, password, isAdmin, navigate, setError, setLoading) => {
    if (!name || !email || !password) {
      setError('Please fill all fields to register.');
      toast.error('Please fill all fields to register.');
      return;
    }
    setLoading(true);
    setError("");
    try {
      const reqBody = { name, email, password };
      if (isAdmin) reqBody.role = 'admin';
      const res = await axios.post('http://localhost:5000/api/register', reqBody);
      setLoading(false);
      toast.success(`Registration successful! ${res.message}`);
      navigate('/login/verify');
    } catch (err) {
      setLoading(false);
      setError('Registration failed. Please try again.');
      toast.error('Registration failed. Please try again.');
    }
  };

  // Verify OTP API call
  const verifyOTP = async (email, otp, navigate, setError, setLoading) => {
    if (!email || !otp) {
      setError('Please enter your email and OTP to verify.');
      toast.error('Please enter your email and OTP to verify.');
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post('http://localhost:5000/api/verify-otp', { email, otp });
      setLoading(false);
      toast.success('Email verified successfully!');
      navigate('/courses');
    } catch (err) {
      setLoading(false);
      setError('Verification failed. Please check your details and try again.');
      toast.error('Verification failed. Please check your details and try again.');
    }
  };

  // resend OTP API call
  const resendOTP = async (email, setError, setLoading) => {
    if (!email) {
      setError('Please enter your email to resend OTP.');
      toast.error('Please enter your email to resend OTP.');
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post('http://localhost:5000/api/resend-otp', { email });
      setLoading(false);
      toast.success('OTP resent successfully!');
    } catch (err) {
      setLoading(false);
      setError('Failed to resend OTP. Please try again.');
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  // Login API call
  const login = async (email, password, navigate, setError, setLoading) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setToken(token);
      setUser(user);
      setLoading(false);
      toast.success('Login successful!');
      navigate('/courses');
    } catch (err) {
      setLoading(false);
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    }
  };

  // Forgot Password API call
  const forgotPassword = async (email, navigate, setError, setLoading) => {
    if (!email) {
      setError('Please enter your email to reset password.');
      toast.error('Please enter your email to reset password.');
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post('http://localhost:5000/api/forgot-password', { email });
      setTimeout(() => {
        setLoading(false);
        toast.success('OTP sent to your email for password reset.');
        navigate('/login/reset-password');
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError('Failed to send OTP. Try again.');
      toast.error('Failed to send OTP. Try again.');
    }
  };

  // reset password API call
  const resetPassword = async (email, otp, newPassword, navigate, setError, setLoading) => {
    if (!email || !otp || !newPassword) {
      setError('Please fill all fields to reset password.');
      toast.error('Please fill all fields to reset password.');
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post('http://localhost:5000/api/reset-password', { email, otp, newPassword });
      setTimeout(() => {
        setLoading(false);
        toast.success('Password reset successful! You can now login.');
        navigate('/login');
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError('Failed to reset password. Please check your details and try again.');
      toast.error('Failed to reset password. Please check your details and try again.');
    }
  };

  // get user profile API call
  const getProfile = async (setError, setLoading) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/my-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLoading(false);
      return res.data.user;
    } catch (err) {
      setLoading(false);
      setError('Failed to load user profile.');
      toast.error('Failed to load user profile.');
      return null;
    }
  };

  // upload user profile picture
  const uploadProfilePicture = async (image, setError, setLoading) => {
    if (!image) {
      setError('Please select an image to upload.');
      toast.error('Please select an image to upload.');
      return;
    }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('file', image); // 'file' matches your multer config
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/update-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setLoading(false);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      setLoading(false);
      setError('Failed to update profile picture. Please try again.');
      toast.error('Failed to update profile picture. Please try again.');
    }
  };

  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, login, forgotPassword, resetPassword, register, verifyOTP, resendOTP, getProfile, uploadProfilePicture }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};