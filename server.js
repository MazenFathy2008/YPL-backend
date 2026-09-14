import dns from "node:dns";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT, FRONTEND_URL } from "./config/env.js";
import { connectDB } from "./config/db.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

await connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
