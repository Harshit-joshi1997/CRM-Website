import connectDB from './db/db.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // middleware
app.use(express.json()); // Replaces bodyParser.json()

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
