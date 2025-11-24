import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import translateRoutes from "./routes/translate.routes.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: "*", // Later you can limit this to your extension ID for security
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Routes
app.use("/api/v1/translate", translateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
