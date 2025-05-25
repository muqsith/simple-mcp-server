import express from "express";
import cors from "cors";

import apiRoutes from "./routes/api.js";

const app = express();
const PORT = process.env.PORT || 8502;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", apiRoutes);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown logic
function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit(0);
  });

  // Force shutdown if not closed in 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});
process.on("exit", (code) => {
  console.log(`Process exited with code: ${code}`);
});
process.on("warning", (warning) => {
  console.warn("Warning:", warning.name, warning.message);
  // Application specific logging, throwing an error, or other logic here
});
