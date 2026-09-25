import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    state: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
      required: true,
    },

    owner: {
      name: {
        type: String,
        trim: true,
        default: null,
      },

      phone: {
        type: String,
        trim: true,
        default: null,
      },

      email: {
        type: String,
        lowercase: true,
        trim: true,
        default: null,
      },
    },

    plant: {
      type: String,
      enum: ["sunflower", "flower", "mint"],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

fieldSchema.index(
  { "owner.phone": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "owner.phone": { $type: "string" },
    },
  },
);

fieldSchema.index(
  { "owner.email": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "owner.email": { $type: "string" },
    },
  },
);

const Field = mongoose.model("Field", fieldSchema, "field");

export default Field;
