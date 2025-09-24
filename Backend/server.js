import connectDB from './db/db.js';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import User from './models/user_model.js';
import Task from './models/task_model.js'; // Assuming this is the path to your Task model
import jwt from 'jsonwebtoken';
import OpenAI from "openai";

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

// JWT authorization middleware to check for specific roles
const authorize = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Forbidden: You do not have the required permissions.' 
      });
    }
    next();
  };
};


dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json()); 

/// OpenAI Configuration

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;  
    // messages is an array of message objects, e.g. 
    // [{ role: 'user', content: 'Hello' }, { role: 'assistant', content: 'Hi there!' }, ...]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or whichever model you choose
      messages: messages,
    });

    const aiMessage = completion.choices[0].message;

    res.json({ message: aiMessage });
  } catch (error) {
    if (error instanceof OpenAI.RateLimitError) {
      console.error('OpenAI Rate Limit Error:', error.message);
      res.status(429).json({ 
        error: 'Rate limit exceeded. You have sent too many requests in a short period. Please wait a moment and try again.' 
      });
    } else if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', error.status, error.message, error.code, error.type);
      res.status(error.status || 500).json({ error: `OpenAI API Error: ${error.message}` });
    } else {
      console.error('Error in /api/chat:', error.message);
      res.status(500).json({ error: 'An unexpected error occurred.' });
    }
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const user = await User.findOne({ email }).lean();
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: 'Login successful', token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



app.post('/employees', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    // For debugging: log the incoming request body
    console.log('Received /employees POST request with body:', req.body);

    const { name, jobTitle, department, joiningDate, email, password, roleType } = req.body;

    // More robust validation to check each field
    const requiredFields = { name, jobTitle, department, joiningDate, email, password, roleType };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({ message: `Field "${field}" is required and cannot be empty.` });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }
    const newUser = new User({ name, username: email, jobTitle, department, joiningDate, email, password, role: roleType });
    await newUser.save();
    res.status(201).json({ message: 'Employee created successfully', employee: newUser });
  } catch (error) {
    // For debugging: log the full error to the server console
    console.error('Error in POST /employees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/employees', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/employees/:id', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Example of a protected route
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: "You have access", user: req.user });
});

app.get('/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/tasks', authenticate, async (req, res) => {
  try {
    // Updated to match the data sent from the frontend Tasks component
    const { employee, designation, department, task, assignee, date, status } = req.body;
    if (!employee || !task || !date) {
      return res.status(400).json({ message: 'Employee, task, and date are required.' });
    }
    // Note: Ensure your Task model schema matches these fields
    const newTask = new Task({ employee, designation, department, task, assignee, date, status });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/tasks/:id', authenticate, authorize(['Admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // The _id field is immutable and should not be part of the update operation.
    delete updates._id;

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid task ID' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Catch-all 404 handler for undefined routes
// This should be the last route handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.method} ${req.originalUrl}` });
});

connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
