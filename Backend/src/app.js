import express from 'express';
import cors from 'cors';

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js"
import cookRoutes from "./modules/cook/cook.routes.js"
import menuRoutes from "./modules/menu/menu.routes.js"
import orderRoutes from "./modules/order/order.routes.js"
import adminRoutes from "./modules/admin/admin.routes.js"

import errorHandler from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cooks', cookRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;