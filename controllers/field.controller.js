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

const allowedPlants = ["sunflower", "flower", "mint"];
export const claimField = async (req, res, next) => {
  try {
    const { id, name, phone, email, plant } = req.body;

    if (
      id === undefined ||
      !name ||
      !phone ||
      !email ||
      !plant
    ) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
      });
    }

    if (!Number.isInteger(Number(id))) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
      });
    }

    if (!allowedPlants.includes(plant)) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
      });
    }

    const normalizedName = name.trim();
    const normalizedPhone = phone.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !normalizedName ||
      !normalizedPhone ||
      !emailRegex.test(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
      });
    }

    const existingContact = await Field.findOne({
      state: "occupied",
      $or: [
        { "owner.phone": normalizedPhone },
        { "owner.email": normalizedEmail },
      ],
    });

    if (existingContact) {
      return res.status(409).json({
        success: false,
        error: "CONTACT_ALREADY_USED",
      });
    }

    const field = await Field.findOneAndUpdate(
      {
        id: Number(id),
        state: "available",
      },
      {
        $set: {
          state: "occupied",
          owner: {
            name: normalizedName,
            phone: normalizedPhone,
            email: normalizedEmail,
          },
          plant,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!field) {
      const existingField = await Field.findOne({
        id: Number(id),
      });

      if (!existingField) {
        return res.status(404).json({
          success: false,
          error: "DATA_NOT_FOUND",
        });
      }

      return res.status(409).json({
        success: false,
        error: "FIELD_OCCUPIED",
      });
    }

    return res.status(200).json({
      success: true,
      id: field.id,
      field,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "CONTACT_ALREADY_USED",
      });
    }

    next(error);
  }
};