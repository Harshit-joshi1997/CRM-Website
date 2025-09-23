import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  employee: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
  },
  department: {
    type: String,
  },
  task: {
    type: String,
    required: true,
  },
  assignee: {
    type: String,
  },
  date: {
    type: String, // Using String as the frontend sends a date string
    required: true,
  },
  status: {
    type: String,
    enum: ["Completed", "In Progress", "Pending"],
    default: "Pending",
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;