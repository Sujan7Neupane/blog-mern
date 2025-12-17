import React, { useState } from "react";
import { Container, Logo, Input, Button } from "../components/index";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login as storeLogin } from "../store/userSlice.js";
import api from "../utils/api.js";

const Signup = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const signupHandler = async (data) => {
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", data.name);
      formData.append(
        "username",
        data.username || data.name.replace(/\s+/g, "").toLowerCase()
      );
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await api.post("/v1/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;

      // Check if the response structure matches what you expect
      if (result.data && result.data.user) {
        dispatch(storeLogin(result.data.user));
      } else if (result.data) {
        dispatch(storeLogin(result.data));
      } else {
        dispatch(storeLogin(result));
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 mx-auto">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-700">
          Sign up to create an account
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(signupHandler)}
          // Removed encType as it's handled by axios
        >
          <Input
            type="text"
            placeholder="Enter your full name"
            label="Full Name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: "Name should only contain letters and spaces",
              },
            })}
          />
          {errors?.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}

          <Input
            type="text"
            placeholder="Enter a username (optional)"
            label="Username"
            {...register("username", {
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              pattern: {
                value: /^[a-z0-9_]+$/,
                message:
                  "Username can only contain lowercase letters, numbers, and underscores",
              },
            })}
          />
          {errors?.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}

          <Input
            type="email"
            placeholder="Enter your email"
            label="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
          />
          {errors?.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          <Input
            type="password"
            placeholder="Enter your password"
            label="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                message:
                  "Password must contain at least one letter and one number",
              },
            })}
          />
          {errors?.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          {error && (
            <div className="mt-4 bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className={`w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Signup;
