import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

/**
 * Parse allowed origins from env
 */
const allowedOrigins = process.env.CORS_ORIGIN.split(",");

console.log(allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

// Middleware order matters
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

// Health check (MANDATORY)
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Routes
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

export { app };
