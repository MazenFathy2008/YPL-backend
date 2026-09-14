import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT, FRONTEND_URL } from "./config/env.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
