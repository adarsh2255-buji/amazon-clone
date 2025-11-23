import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDb from './config/db.js';
import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express()
connectDb();

//middleware
app.use(cors());
app.use(express.json());


//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get('/', (req, res) => {
  res.send('API is running...')
})
// Error Middleware
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


