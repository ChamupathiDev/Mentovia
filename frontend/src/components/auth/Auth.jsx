// src/components/auth/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import { AUTH_ENDPOINTS } from '../../config/apiConfig';
import { useToast } from '../common/Toast';
import { auth, provider } from '../../config/firebase.js';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Auth = () => {
  const [isActive, setIsActive] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'BEGINNER',
  });

  const navigate = useNavigate();
  const { addToast } = useToast();

  // Theme configuration
  const themeConfig = {
    light: {
      bg: 'from-gray-100 to-blue-100',
      formBg: 'bg-white',
      text: 'text-gray-800',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      secondaryBg: 'bg-blue-500',
      toggleButton: 'text-gray-600 hover:bg-blue-100',
    },
    dark: {
      bg: 'from-gray-800 to-gray-900',
      formBg: 'bg-gray-800',
      text: 'text-gray-100',
      buttonBg: 'bg-blue-500 hover:bg-blue-600',
      secondaryBg: 'bg-blue-600',
      toggleButton: 'text-gray-300 hover:bg-gray-700',
    },
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginData.email, password: loginData.password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.user.role);
        addToast('Login successful!', 'success');
        navigate('/profile');
      } else {
        addToast(data.message || 'Login failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('Login error. Please try again.', 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { message: `Error: ${response.status} ${response.statusText}` };
      }

      if (response.ok) {
        addToast('Registration successful! Please login.', 'success');
        setIsActive(false);
      } else {
        addToast(data.message || 'Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      addToast('An error occurred during registration. Please try again.', 'error');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      // Optionally send token or user info to your backend here
      const idToken = await user.getIdToken();
      localStorage.setItem('token', idToken);
      addToast('Google Sign-In successful!', 'success');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      addToast('Google Sign-In failed.', 'error');
    }
  };

  return (
    <div className={`flex justify-center items-center min-h-screen bg-gradient-to-r ${themeConfig[theme].bg} transition-colors duration-300`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
        className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${themeConfig[theme].toggleButton}`}
      >
        {theme === 'light' ? (
          <i className="bx bxs-moon text-xl"></i>
        ) : (
          <i className="bx bxs-sun text-xl"></i>
        )}
      </button>

      <div className={`relative w-[850px] h-[550px] ${themeConfig[theme].formBg} m-5 rounded-3xl shadow-lg overflow-hidden transition-colors duration-300`}>
        {/* Login Form Box */}
        <div
          className={`absolute w-1/2 h-full ${themeConfig[theme].formBg} flex items-center ${themeConfig[theme].text} text-center p-10 z-10 transition-all duration-700 ease-in-out ${
            isActive ? 'opacity-0 pointer-events-none right-1/2' : 'opacity-100 right-0'
          }`}
        >
          <form onSubmit={handleLoginSubmit} className="w-full">
            <h1 className="text-4xl -mt-2.5 mb-0">Login</h1>
            <div className="relative my-7">
              <input
                type="email"
                placeholder="Email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className={`w-full py-3 px-5 pr-12 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg outline-none text-base ${themeConfig[theme].text} font-medium transition-colors`}
              />
              <i className="bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="relative my-7">
              <input
                type="password"
                placeholder="Password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className={`w-full py-3 px-5 pr-12 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg outline-none text-base ${themeConfig[theme].text} font-medium transition-colors`}
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="-mt-4 mb-4">
              <a href="#" className={`text-sm ${themeConfig[theme].text} hover:text-blue-400 transition-colors`}>
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              className={`w-full h-12 rounded-lg shadow-md text-base text-white font-semibold ${themeConfig[theme].buttonBg} transition-colors`}
            >
              Login
            </button>
            <p className="text-sm my-4">or login with</p>
            <div className="flex justify-center">
  <button
    onClick={handleGoogleSignIn}
    className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-2xl mx-2 transition-colors"
  >
    <i className="bx bxl-google text-black"></i>
  </button>
</div>



          </form>
        </div>

        {/* Register Form Box */}
        <div
          className={`absolute w-1/2 h-full ${themeConfig[theme].formBg} flex items-center ${themeConfig[theme].text} text-center p-10 z-10 transition-all duration-700 ease-in-out ${
            isActive ? 'opacity-100 left-0' : 'opacity-0 pointer-events-none right-0'
          }`}
        >
          <form onSubmit={handleRegisterSubmit} className="w-full">
            <h1 className="text-4xl -mt-2.5 mb-0">Registration</h1>
            <div className="grid grid-cols-2 gap-4 mt-6">
              {['firstName', 'lastName'].map((field) => (
                <div key={field} className="relative">
                  <input
                    type="text"
                    placeholder={field === 'firstName' ? 'First Name' : 'Last Name'}
                    value={registerData[field]}
                    onChange={(e) => setRegisterData({ ...registerData, [field]: e.target.value })}
                    className={`w-full py-3 px-5 pr-12 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg outline-none text-base ${themeConfig[theme].text} font-medium transition-colors`}
                  />
                  <i className="bx bx-user absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
                </div>
              ))}
            </div>
            <div className="relative my-5">
              <input
                type="text"
                placeholder="Username"
                required
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                className={`w-full py-3 px-5 pr-12 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg outline-none text-base ${themeConfig[theme].text} font-medium transition-colors`}
              />
              <i className="bx bx-at absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="relative my-5">
              <input
                type="email"
                placeholder="Email"
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className={`w-full py-3 px-5 pr-12 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg outline-none text-base ${themeConfig[theme].text} font-medium transition-colors`}
              />
              <i className="bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <div className="relative my-5">  
              <input
                type="password"
                placeholder="Password"
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className={`w-full py-3 px-5 pr-12 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg outline-none text-base ${themeConfig[theme].text} font-medium transition-colors`}
              />
              <i className="bx bxs-lock-alt absolute right-5 top-1/2 transform -translate-y-1/2 text-xl"></i>
            </div>
            <button
              type="submit"
              className={`w-full h-12 rounded-lg shadow-md text-base text-white font-semibold ${themeConfig[theme].buttonBg} transition-colors`}
            >
              Register
            </button>
            <p className="text-sm my-4">or register with</p>
            <div className="flex justify-center">
              {/* You can add more social sign-ups here if desired */}
            </div>
          </form>
        </div>

        {/* Toggle Box with sliding background */}
        <div className="absolute w-full h-full">
          <div className="absolute w-full h-full overflow-hidden">
            <div
              className={`absolute w-[300%] h-full rounded-[150px] transition-all duration-[1.8s] ease-in-out transform ${
                isActive ? 'left-[calc(-50%+850px)]' : '-left-[250%]'
              } ${themeConfig[theme].secondaryBg}`}
            ></div>
          </div>

          {/* Toggle Panels */}
          <div
            className={`absolute left-0 w-1/2 h-full flex flex-col justify-center items-center z-20 transition-all duration-700 ease-in-out ${
              isActive ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'
            } ${themeConfig[theme].text}`}
          >
            <h1 className="text-4xl">Hello, Welcome!</h1>
            <p className="mb-5 text-sm">Don't have an account?</p>
            <button
              className={`w-40 h-[46px] rounded-lg font-semibold border-2 ${
                theme === 'dark' ? 'border-gray-300 hover:bg-gray-700' : 'border-gray-800 hover:bg-blue-100'
              } transition-colors`}
              onClick={() => setIsActive(true)}
            >
              Register
            </button>
          </div>

          <div
            className={`absolute right-0 w-1/2 h-full flex flex-col justify-center items-center z-20 transition-all duration-700 ease-in-out ${
              isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
            } ${themeConfig[theme].text}`}
          >
            <h1 className="text-4xl">Welcome Back!</h1>
            <p className="mb-5 text-sm">Already have an account?</p>
            <button
              className={`w-40 h-[46px] rounded-lg font-semibold border-2 ${
                theme === 'dark' ? 'border-gray-300 hover:bg-gray-700' : 'border-gray-800 hover:bg-blue-100'
              } transition-colors`}
              onClick={() => setIsActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
