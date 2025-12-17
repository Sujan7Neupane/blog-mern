import React, { useState } from "react";
import { Button, Container, Input, Logo } from "../components/index.js";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/userSlice.js";
import api from "../utils/api.js";

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (data) => {
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/v1/users/login", data);
      const user = res.data?.data?.user;

      if (!user) throw new Error("Invalid server response");

      dispatch(storeLogin(user));
      setSuccess("Login successful!");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container>
      <div className="w-full max-w-md bg-gray-10 shadow-lg rounded-2xl p-8">
        {/* <!-- Logo --> */}
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {/* <!-- Title --> */}
        <h1 className="text-2xl font-bold text-center text-gray-700">
          Sign in to your account
        </h1>

        {/* <!-- Subtitle --> */}
        <p className="text-center text-gray-500 mt-2">
          Don't have an account?{" "}
          <Link to={"/register"} className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>

        {/* <!-- Form --> */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(login)}>
          <Input
            type="email"
            id="email"
            label="Email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {/* Error message */}
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          <Input
            type="password"
            id="password"
            label="Password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message: "Password must contain letters and numbers",
              },
            })}
          />

          {/* <!-- Error Message --> */}
          {error && (
            <div className="mt-4 bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg">
              {error.includes("password")
                ? "Invalid username or password."
                : error}
            </div>
          )}

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          {success && (
            <div className="mt-4 bg-green-200 text-green-900 text-xl p-4">
              {success}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition cursor-pointer"
          >
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
