import dns from "node:dns";
import mongoose from "mongoose";

import Field from "../models/field.model.js";

import { MONGODB_URI } from "../config/env.js";

dns.setServers(["8.8.8.8"]);

const seedField = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB.");

    const fields = Array.from({ length: 60 }, (_, index) => ({
      id: index + 1,
      state: "available",
      owner: null,
      plant: null,
    }));

    await Field.deleteMany({});

    await Field.insertMany(fields);

    console.log("Successfully created 60 field plots.");

    await mongoose.disconnect();

    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Failed to seed field:", error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

seedField();
