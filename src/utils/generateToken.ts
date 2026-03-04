import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import type { Response } from "express";
process.loadEnvFile();
const generateToken = (res: Response, userId: mongoose.Types.ObjectId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRY_TIME,
  } as jwt.SignOptions);
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV !== "",
  });
};

export default generateToken;
