import  { useState } from 'react';
import Cookies from 'js-cookie';
import { useCurrentUser } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../constraint';
const Login = () => {
    const {
        currentUser, setCurrentUser,
    } = useCurrentUser();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  const validate = () => {
    const errors = {};

    if (!formData.email && !formData.username) {
      errors.usernameOrEmail = 'Username or Email is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the input is an email or username
    if (name === 'usernameOrEmail') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(value)) {
        setFormData({ ...formData, email: value, username: '' });
      } else {
        setFormData({ ...formData, username: value, email: '' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        })
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setMessage('Login successful!');
        const { accessToken, refreshToken, user } = result.data;
        Cookies.set(
          "accessToken",
          accessToken,
          { expires: 7 },
          { httpOnly: true, secure: true }
        );
        Cookies.set(
          "refreshToken",
          refreshToken,
          { expires: 7 },
          { httpOnly: true, secure: true }
        );
       setCurrentUser(user);
       navigate('/')
        // Handle successful login (e.g., redirect, store token, etc.)
      } else {
        setMessage(result.message || 'Login failed');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.'+ error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-gray-700">
              Username or Email
            </label>
            <input
              type="text"
              name="usernameOrEmail"
              id="usernameOrEmail"
              className={`w-full px-4 py-2 mt-1 text-sm border ${
                errors.usernameOrEmail ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your username or email"
              value={formData.email || formData.username}
              onChange={handleChange}
              required
            />
            {errors.usernameOrEmail && (
              <p className="mt-1 text-sm text-red-500">{errors.usernameOrEmail}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={`w-full px-4 py-2 mt-1 text-sm border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
