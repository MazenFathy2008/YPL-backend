import express from "express";
import { getField } from "../controllers/field.controller.js";

const router = express.Router();

router.get("/", getField);

export default router;
