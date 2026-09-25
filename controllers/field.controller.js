import Field from "../models/field.model.js";

export const getField = async (req, res, next) => {
  try {
    const field = await Field.find().sort({ id: 1 });

    res.status(200).json({
      success: true,
      field,
    });
  } catch (error) {
    next(error);
  }
};
