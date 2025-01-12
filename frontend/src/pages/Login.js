import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {baseUrl} from '../utils/apiConfig'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate form fields
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${baseUrl}/login`, { email, password },{withCredentials:true});
      if (response.data.auth.token) {
        localStorage.setItem("token", JSON.stringify(response.data.auth));
        alert(response.data.message);
       
      }
      if(response.data.auth.role==='admin'){
        navigate('/');
      }else{
        navigate('/candidate_profile');
      }
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-5 m-5">
      <h1 className="p-1 text-2xl font-medium text-center text-[#6c01c5] border-[1px] border-[#6c01c5] bg-[#f5ecfc] rounded-t-md">
        Login
      </h1>
      <form className="bg-white p-6 shadow-xl border-[1px] border-[#6c01c5] rounded-b-md" onSubmit={handleLogin}>
        <div className="grid grid-cols-1 gap-2 text-left">
          <div className="col-span-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 py-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full border-[1px] outline-none focus:shadow-md text-sm p-2 ${
                errors.email ? "border-red-500" : "border-[#6c01c5]"
              }`}
              placeholder="example@example.com"

            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="col-span-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 py-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full border-[1px] outline-none focus:shadow-md text-sm p-2 ${
                errors.password ? "border-red-500" : "border-[#6c01c5]"
              }`}
              placeholder="Password"

            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="mt-6 col-span-1 py-2">
            <button
              type="submit"
              className="w-full bg-[#6c01c5] hover:bg-[#540793] text-white py-1 px-4 text-lg font-medium shadow-lg"
            >
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
