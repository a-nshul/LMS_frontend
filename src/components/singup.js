import React, { useState } from 'react';
import { Input, Button, Select, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Option } = Select;

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !role) {
      message.error('All fields are required!');
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error('Please enter a valid email address!');
      return;
    }
  
    if (!validatePassword(password)) {
      message.error(
        'Password must be at least 8 characters long, include an uppercase letter, and a number.'
      );
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/user', {
        name,
        email,
        password,
        role,
      });
  
      // Check if the response contains a 'success' key and its value is true
      message.success("User registered successfully");
      navigate("/");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'An error occurred. Please try again.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  

  const handleLoginRedirect = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-400 to-blue-600">
      <div className="w-full max-w-md sm:max-w-lg bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h1>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <div className="mb-4">
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              aria-label="Name"
            />
          </div>

          <div className="mb-4">
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              aria-label="Email"
            />
          </div>

          <div className="mb-4">
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              aria-label="Password"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="role-select"
              className="block text-gray-700 font-medium mb-2"
            >
              Select Your Role
            </label>
            <Select
              id="role-select"
              placeholder="Select Role"
              value={role}
              onChange={(value) => setRole(value)}
              className="w-full"
              aria-label="Role"
            >
              {['student', 'teacher', 'admin'].map((role) => (
                <Option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </Option>
              ))}
            </Select>
          </div>

          <Button
            type="primary"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSignup}
            loading={loading}
            disabled={loading}
            aria-label="Sign Up"
          >
            Sign Up
          </Button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <span
            onClick={handleLoginRedirect}
            className="text-blue-500 cursor-pointer hover:underline hover:text-blue-600"
          >
            Log in here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
