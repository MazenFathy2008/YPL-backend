import bcrypt from "bcrypt";
import Member from "../models/member.model.js";

export const createApplication = async (req, res, next) => {
  try {
    const { name, email, phone, password, question } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await Member.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "member",
      events: {},
      // question,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};
