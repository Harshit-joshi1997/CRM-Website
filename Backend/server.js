import connectDB from './db/db.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import User from './models/user_model.js';
import Employee from './models/employee_model.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Use a generic message to avoid disclosing whether an email is registered
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // In a real app, you MUST compare hashed passwords. This is for demonstration only.
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // In a real app, you'd generate and return a JWT token here
    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/employees', async (req, res) => {
  try {
    const { name, jobTitle, department, joiningDate, email, password } = req.body;
    if (!name || !jobTitle || !department || !joiningDate || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({ message: 'Employee with this email already exists.' });
    }
    const newEmployee = new Employee({ name, jobtitle: jobTitle, department, joiningDate, email, password });
    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully', employeeId: newEmployee._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
