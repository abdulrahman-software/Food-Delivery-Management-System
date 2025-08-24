import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import customerRoutes from "./routes/customers.js";
import restaurantRoutes from "./routes/restaurants.js";
import orderRoutes from "./routes/orders.js";
import authRoutes from "./routes/auth.js";
import session from "express-session";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session( { 
  secret: "FoodDeliverySystem",
  resave: false,
  saveUninitialized: true
}));
app.use("/", (req, res, next) => {
  req.session.test = "test";
  next();
})
app.use("/customers", customerRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.use((err, req, res, next)=> {
  const {status = 500, message = false} = err;
  res.status(status).send(message);
  next(err);
});
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});