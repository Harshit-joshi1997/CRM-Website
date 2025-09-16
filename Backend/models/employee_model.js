import mongoose from "mongoose";

const { Schema } = mongoose;

const employeeSchema = new Schema({
    name: {
    type: String,
    required: true,
    unique: true,
  },jobtitle: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
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
