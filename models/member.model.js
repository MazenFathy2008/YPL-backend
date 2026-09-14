import mongoose from "mongoose";
const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
    events: {
      type: Map,
      of: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
      },
      default: {},
    },
  },
  {
    timestamps: true,
  },
);
const Member = mongoose.model("Member", memberSchema);
export default Member;