import express from 'express';
import cookieParser from 'cookie-parser'; 
import cors from 'cors';
import dotenv from 'dotenv';
import databaseConnect from './utils/db.js';

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: ["http://localhost:5121"],
  credentials: true,
};
app.use(cors(corsOptions));

// routes
app.get('/', (req, res) => {
  res.send('API is running...');
});


// connect to database and then start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await databaseConnect();  // wait for DB connection first
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Failed to start server:", err.message);
  }
};

startServer();
