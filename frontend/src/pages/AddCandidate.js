import React, { useState } from "react";
import axios from "axios";
import {baseUrl} from '../utils/apiConfig'

const AddCandidate = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    address: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear the error for the field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/create_candidate`,
        formData, {withCredentials:true}
      );

      if (response.status === 200 || response.status === 201) {
        alert(response.data.message);
        setFormData({ name: "", mobile: "", email: "", password: "", address: "" }); // Reset form
      } else {
        alert("Failed to add candidate. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl border-[1px] border-[#6c01c5] mt-10">
      <h1 className="p-1 text-xl font-medium text-center text-[#6c01c5] border-b-[1px] border-[#6c01c5] bg-[#f8f2fd]">
        Candidate Entry Form
      </h1>

      <form
        className="bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="col-span-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 py-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border-[#6c01c5] border-[1px] outline-none focus:shadow-md focus:ring-blue-500 focus:border-[1.5px] text-sm p-2"
              placeholder="Enter your name"
              
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="col-span-1">
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 py-2">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="mt-1 block w-full border-[#6c01c5] border-[1px] outline-none focus:shadow-md focus:ring-blue-500 focus:border-[1.5px] text-sm p-2"
              placeholder="Mobile Number"
              
            />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
          </div>

          <div className="col-span-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 py-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border-[#6c01c5] border-[1px] outline-none focus:shadow-md focus:ring-blue-500 focus:border-[1.5px] text-sm p-2"
              placeholder="example@example.com"
              
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="col-span-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 py-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full border-[#6c01c5] border-[1px] outline-none focus:shadow-md focus:ring-blue-500 focus:border-[1.5px] text-sm p-2"
              placeholder="Enter your password"
              
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
          <div className="col-span-1 ">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 py-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border-[#6c01c5] border-[1px] outline-none focus:shadow-md focus:ring-blue-500 focus:border-[1.5px] text-sm p-2"
              placeholder="Enter your address"
              
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="mt-6 col-span-1 py-2">
            <button
              type="submit"
              className="w-full bg-[#6c01c5] hover:bg-[#540793] text-white py-1 px-4 text-lg font-medium shadow-lg"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddCandidate;
