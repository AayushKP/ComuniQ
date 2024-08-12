import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL;
console.log("PORT:", port);
console.log("ORIGIN:", process.env.ORIGIN);
console.log("DATABASE_URL:", databaseURL);

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

const server = app.listen(port, () => {
  console.log(`server is running at ${port}`);
});

mongoose
  .connect(databaseURL)
  .then(() => console.log("DB connection successful"))
  .catch((err) => err.message);
