import express from "express";
import {
  getField,
  claimField,
} from "../controllers/field.controller.js";

const router = express.Router();

router.get("/", getField);
router.post("/claim", claimField);

export default router;