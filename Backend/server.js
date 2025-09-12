import connectDB from './db/db.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // middleware
app.use(express.json()); // Replaces bodyParser.json()

app.post('/api/reg', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})



connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
