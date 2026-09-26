import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import Member from "../models/member.model.js";
import { JWT_SECRET, NODE_ENV } from "../config/env.js";
const isProduction = NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const member = await Member.findOne({ email });

    console.log(email);

    if (!member) {
      return res.status(401).json({
        success: false,
        error: "INVALID_CREDENTIALS",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, member.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        error: "INVALID_CREDENTIALS",
      });
    }

    const token = jwt.sign(
      {
        id: member._id,
        role: member.role,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      authenticated: true,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        events: member.events,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const member = await Member.findById(decoded.id).select("-password");

    if (!member) {
      return res.status(404).json({
        success: false,
        error: "DATA_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      member,
    });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        error:
          error.name === "TokenExpiredError"
            ? "TOKEN_EXPIRED"
            : "INVALID_TOKEN",
      });
    }

    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};
