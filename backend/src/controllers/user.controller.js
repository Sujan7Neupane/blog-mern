import asyncHandler from "../utils/asyncHandlerWrapper.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// Helper: generate access and refresh tokens
const generateTokens = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// Cookie options
const getCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 1000 * 60 * 60 * 24,
});

// REGISTER
const userRegister = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  //   Checking empty fields
  if (
    [name, username, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //   validating email
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Please enter a valid email");
  }

  //   checking password length
  if (password.length < 8) {
    throw new ApiError(400, "Please enter a strong password");
  }

  //   validating email existing
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists with username or email");
  }

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    email,
    password,
  });

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const registeredUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, getCookieOptions())
    .cookie("refreshToken", refreshToken, getCookieOptions())
    .json(
      new ApiResponse(
        200,
        { user: registeredUser },
        "User Registered Successfully!"
      )
    );
});

// LOGIN
const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!password || !(username || email)) {
    throw new ApiError(400, "Credentials missing");
  }

  const user = await User.findOne({
    $or: [
      { username: username?.toLowerCase() },
      { email: email?.toLowerCase() },
    ],
  });

  if (!user) throw new ApiError(404, "User not found");

  const isValid = await user.isPasswordCorrect(password);
  if (!isValid) throw new ApiError(401, "Invalid password");

  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, getCookieOptions())
    .cookie("refreshToken", refreshToken, getCookieOptions())
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser },
        "User logged in successfully"
      )
    );
});

// LOGOUT
const userLogout = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1 },
    });
  }

  return res
    .status(200)
    .clearCookie("accessToken", getCookieOptions())
    .clearCookie("refreshToken", getCookieOptions())
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// ROTATE REFRESH TOKEN
const rotateRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  return res
    .status(200)
    .cookie("accessToken", accessToken, getCookieOptions())
    .cookie("refreshToken", refreshToken, getCookieOptions())
    .json(new ApiResponse(200, {}, "Token refreshed successfully"));
});

// GET CURRENT USER
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Current user fetched"));
});

export {
  userRegister,
  userLogin,
  userLogout,
  rotateRefreshToken,
  getCurrentUser,
};
