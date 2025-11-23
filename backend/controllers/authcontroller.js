import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Send Token Response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  // Sanitize user for response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  res.status(statusCode).json({
    success: true,
    token,
    user: userResponse
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

  if (userExists) {
      res.status(400);
      throw new Error("Email already exists");
    }

    const salt = await import("bcryptjs").then(m => m.genSalt(10));
    const hashedPassword = await import("bcryptjs").then(m => m.hash(password, salt));
    
    //This prevents someone from sending { role: "admin" } in the body
    const safeRole = role === 'seller' ? 'seller' : 'customer'; 

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: safeRole
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide an email and password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401); // 401 is unauthorized
      throw new Error("Invalid credentials");
    }
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid credentials");
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);  }
};

// @desc    Google Auth (Secure Verification)
// @route   POST /api/auth/google
export const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body; // We expect an ID TOKEN, not raw data

    if (!idToken) {
        res.status(400);
        throw new Error("No Google ID Token provided");
    }

    // Verify the token with Google servers
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, 
    });

    const { email, name, sub: googleId, picture } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        googleId,
        password: "", // No password for google auth
        role: 'customer' // Default role
      });
    } else if (!user.googleId) {
      // Link Google ID to existing account if they signed up with email previously
      user.googleId = googleId;
      await user.save();
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};
