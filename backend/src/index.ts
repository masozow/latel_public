import dotenv from "dotenv"; //needed to deploy on railway
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import bodyParser from "body-parser";

//----------- For database updates--------
// import sequelize from "./config/sequelize.js";
// import "./models/index.js";


// Routes
import estadoRoutes from "./routes/estado.routes.js";
import rolRoutes from "./routes/rol.routes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import bodegaRoutes from "./routes/bodega.routes.js";
// import historicDataRoutes from "./routes/historicData.route.js";

dotenv.config();
const app = express();

// Global middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET)); // to sign cookies

// Sync database (development mode)
// await sequelize.sync({ alter: true }); //uncomment only when changes are needed in DB

// Routes
app.use("/api", estadoRoutes);
app.use("/api", userRoutes);
app.use("/api", rolRoutes);
app.use("/api", authRoutes);
app.use("/api", bodegaRoutes);

// Global error middleware
app.use((err, req, res, next) => {
  console.error("Unexpected error: ", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}\n`);
});

export default app;