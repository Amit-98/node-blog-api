import authMiddleware from "../middleware/auth.js";
import Router from "express";

import Auth from "./Auth/index.js";
import Admin from "./Admin/index.js";
import Products from "./Product/index.js";
import User from "./User/index.js";
const app = Router();

//without middleware routes
app.use("/auth", Auth);

// Middleware connection setup
app.use(authMiddleware)
app.use("/admin", Admin);
app.use('/product', Products);
app.use('/user', User);

export default app;