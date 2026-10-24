import mongoose from "mongoose";
import dns from "node:dns";

import Application from "../models/application.model.js";
import Member from "../models/member.model.js";

import { MONGODB_URI } from "../config/env.js";

dns.setServers(["8.8.8.8"]);

const migrateApplicationsToMembers = async () => {
  let migrated = 0;
  let skippedExisting = 0;
  let failed = 0;

  try {
    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB.");

    // Fetch all applications regardless of their status.
    const applications = await Application.find({}).lean();

    console.log(`Found ${applications.length} applications.`);

    for (const application of applications) {
      try {
        const email = application.email.toLowerCase().trim();

        const existingMember = await Member.findOne({ email });

        if (existingMember) {
          skippedExisting++;
          console.log(`Skipped existing email: ${email}`);
          continue;
        }

        await Member.create({
          name: application.name,
          email,
          phone: application.phone,
          password: application.password,
          role: "member",
          events: {},
          createdAt: application.createdAt,
          updatedAt: application.updatedAt,
        });

        migrated++;

        console.log(`Migrated: ${email} (status: ${application.status})`);
      } catch (error) {
        failed++;

        console.error(
          `Failed to migrate ${application.email}:`,
          error.message,
        );
      }
    }

    console.log("\nMigration summary:");
    console.log(`Migrated: ${migrated}`);
    console.log(`Skipped (already exists): ${skippedExisting}`);
    console.log(`Failed: ${failed}`);
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log("Disconnected from MongoDB.");
  }
};

migrateApplicationsToMembers();