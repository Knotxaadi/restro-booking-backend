import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { initWebSocket } from "../api/websockets/websockets";

import Customer_pannel from "./routes/customer";
import Manager_pannel from "./routes/manager";
import Chef_pannel from "./routes/chef";
import Auth from "./supabase/auth";

dotenv.config();

const app = express();

/* PORT FIX (IMPORTANT FOR RENDER) */
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

/* CORS FIX FOR PRODUCTION */
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "https://restro-booking-frontend.vercel.app",
    ],
    credentials: true,
  }),
);

/* HTTP SERVER FOR WEBSOCKET */
const server = http.createServer(app);
initWebSocket(server);

/* ROUTES */
app.use("/restro/customer", Customer_pannel);
app.use("/restro/manager", Manager_pannel);
app.use("/restro/chef", Chef_pannel);
app.use("/restro/auth", Auth);

app.get("/", (req, res) => {
  res.send("API Running");
});

/* START SERVER */
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
