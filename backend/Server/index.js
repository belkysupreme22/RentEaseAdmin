const express = require("express");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/admin");
const cors = require("cors");

const corsOptions = {
  origin: "*", // Allow requests from this origin (your React frontend)
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers in requests
  exposedHeaders: ["Content-Length", "X-Requested-With"], // Expose these headers to the client
  credentials: true, // Allow cookies to be sent with requests
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

//cors config
app.use(cors(corsOptions));

// Define Routes
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
