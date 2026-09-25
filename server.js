import dns from "node:dns";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PORT, FRONTEND_URL } from "./config/env.js";
import { connectDB } from "./config/db.js";
import errorsMiddleware from "./middlewares/errors.middleware.js";
import applicationRoutes from "./routes/application.routes.js";
import authRoutes from "./routes/auth.routes.js";
import fieldRoutes from "./routes/field.routes.js";
dns.setServers(["8.8.8.8"]);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use("/applications", applicationRoutes);
app.use(errorsMiddleware);
app.use("/auth", authRoutes);
app.use("/field", fieldRoutes);
await connectDB();
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
