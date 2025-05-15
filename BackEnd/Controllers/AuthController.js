import { hash, compare } from "bcrypt";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import UserModel from "../Models/user.js";
import dotenv from "dotenv";
dotenv.config();

const signup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Check if the required fields are present
    if (!name || !email || !username || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return res.status(409).json({
        message: "Email is already registered, please login",
        success: false,
      });
    }

    const usernameExists = await UserModel.findOne({ username });
    if (usernameExists) {
      return res.status(409).json({
        message: "Username is already taken, please choose another",
        success: false,
      });
    }

    const hashedPassword = await hash(password, 10);
    const userModel = new UserModel({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await userModel.save();

    res.status(201).json({
      message: "Signup successful",
      success: true,
    });
  } catch (err) {
    console.error("Signup Error:", err.message); // Log the error message
    res.status(500).json({
      message: "500 Internal server error",
      success: false,
      error: err.message, // Include the actual error message in the response
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const errorMsg = "Auth failed, username or password is incorrect";

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const isPassEqual = await compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // Check if JWT_SECRET is correctly loaded
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const jwtToken = sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      username,
      name: user.name,
    });
  } catch (err) {
    console.error("Login Error:", err.message); // Log the error message
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err.message, // Include the actual error message in the response
    });
  }
};

export { signup, login };
