import express from "express";
import cors from "cors";

import dashboardRoutes from "./routes/dashboardRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import mechanicRoutes from "./routes/mechanicRoutes";
import customerRoutes from "./routes/customerRoutes";
import serviceRoutes from "./routes/serviceRoutes";

import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Instant Mechanic API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/mechanics",
  mechanicRoutes
);

app.use(
  "/api/customers",
  customerRoutes
);

app.use(
  "/api/services",
  serviceRoutes
);

app.use(errorHandler);

export default app;