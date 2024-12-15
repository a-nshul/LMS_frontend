import React, { useState } from 'react';
import { Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      message.error('Please enter both email and password!');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:3001/api/user/login', {
        email,
        password,
      });
  
      // Assuming response contains a token and user details
      const { token, user } = response.data;
  
      // Save token and user ID in local storage or cookies
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', user._id);
  
      message.success("Successfully logged in");
      navigate('/dashboard');
    } catch (error) {
      message.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>
        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        <div className="mb-4">
          <Input
            prefix={<UserOutlined />}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            autoComplete="off"
            style={{ borderColor: '#4F46E5' }}
          />
        </div>
        <div className="mb-6">
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
            autoComplete="off"
            style={{ borderColor: '#4F46E5' }}
          />
        </div>

        <Button
          type="primary"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
          onClick={handleLogin}
          loading={loading}
        >
          Login
        </Button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <span
            onClick={handleSignupRedirect}
            className="text-blue-500 cursor-pointer hover:text-blue-600"
          >
            Sign up here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
