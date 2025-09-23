import mongoose from "mongoose";

const { Schema } = mongoose;

const employeeSchema = new Schema({
  
    name: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
    department: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Employee'],
    default: 'Employee'
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password:{
    type: String,
    required: true,
  }   

},{ timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
