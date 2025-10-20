import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";
import documentRoutes from "./routes/documentRoutes.js"
import cookieParser from 'cookie-parser';
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // if you're using cookies or HTTP authentication
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));