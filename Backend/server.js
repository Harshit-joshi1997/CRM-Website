import connectDB from './db/db.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import User from './models/user_model.js';
import Employee from './models/employee_model.js';
import jwt from 'jsonwebtoken';

// JWT authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Pass user data to subsequent middleware
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

const jwtSecret = 'YOUR_SECRET_KEY'; // Replace with your actual secret key


app.post('/login', async (req, res) => {
const { email, password } = req.body;

  try {
   const { email, password } = req.body;
   if (!email || !password) {
     return res.status(400).json({ message: 'All fields are required.' });
   }
   const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



app.post('/employees', authenticate, async (req, res) => {
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

app.get('/employees', authenticate, async (req, res) => {

// Example of a protected route
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: "You have access", user: req.user });
});
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});




connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
