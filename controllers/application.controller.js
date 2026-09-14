import bcrypt from "bcrypt";
import Application from "../models/application.model.js";
export const createApplication = async (req, res, next) => {
  try {
    const { name, email, phone, password, question } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await Application.create({
      name,
      email,
      phone,
      password: hashedPassword,
      question,
    });
    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};
