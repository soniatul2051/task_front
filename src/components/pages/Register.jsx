import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { baseUrl } from '../../constraint';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullname: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validate = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Email is not valid';
    }

    if (!formData.fullname) {
      errors.fullname = 'Full name is required';
    }

    if (!formData.username) {
      errors.username = 'Username is required';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${baseUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
        
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Registration successful!');
        // Handle successful registration (e.g., redirect, show success message)
      } else {
        setMessage(result.message || 'Registration failed');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={`w-full px-4 py-2 mt-1 text-sm border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              className={`w-full px-4 py-2 mt-1 text-sm border ${
                errors.fullname ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your full name"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
            {errors.fullname && <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>}
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className={`w-full px-4 py-2 mt-1 text-sm border ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
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
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <div>
            Already have account? <Link to="/login">Login</Link>
        </div>
        </form>
        {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
      </div>
      
    </div>
  );
};

export default Register;
