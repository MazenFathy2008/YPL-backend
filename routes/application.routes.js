import express from "express";
import { createApplication } from "../controllers/application.controller.js";

const router = express.Router();

router.post("/", createApplication);

export default router;
