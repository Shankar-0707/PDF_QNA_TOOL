import User from "../models/User.js";
import generateToken from "../services/jwtService.js";
import jwt from "jsonwebtoken";


const cookieOptions = {
    httpOnly: true,
    path: '/',
    // Use dynamic settings for production, but force cross-origin settings for dev
    secure: process.env.NODE_ENV === 'production' ? true : true, // Forcing TRUE for cross-origin local dev
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none', // Forcing NONE for cross-origin local dev
    // Make sure 'withCredentials: true' is used on the frontend Axios calls
};

// POST /api/users/signup

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ email, password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, cookieOptions);

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

// POST /api/users/login
export const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, cookieOptions);

    res.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

// Get /api/users/logout

export const logoutUser = async (req, res) => {
    // 🛑 FIX: Change res.cookie() to res.clearCookie()
    // It is critical to pass the same options (cookieOptions) for deletion to succeed.
    res.clearCookie("token", cookieOptions); 

    res.status(200).json({ message: 'Logged out successfully' });
};



