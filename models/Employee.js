const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required."]
  },
  lastName: {
    type: String,
    required: [true, "Last name is required."]
  },
  userName: {
    type: String,
    required: [true, "Username is required."],
    unique: [true, "Username must be unique."]
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email must be unique."]
  },
  password: {
    type: String,
    required: [true, "Password is required."]
  },
  phone:{
    type:String,
    required: [true, "Phone number is required."]
  },
  department: {
    type:String,
    required: [true, "Department is required."]
  },
  designation:{
    type:String,
    required: [true, "Designation is required."]
  },
  cnic: {
    type: String,
    required: [true, 'CNIC is required'],
    unique: true,
    minlength: [13, 'CNIC should be 13 characters long'],
    maxlength: [13, 'CNIC should be 13 characters long']
  },
  homePhone: {
    type: String,
    required: [true, 'Home Phone Number is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  dob: {
    type: Date,
    required: [true, 'Date of Birth is required']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Gender is required']
  },
  religion: {
    type: String,
    required: [true, 'Religion is required']
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: [true, 'Blood group is required']
  },
  role: {
    type: String,
    enum: ['admin', 'employee'],
    default: 'employee'
  },
  ipRestrictions: {
    type: [String]
  },
  clockInTime: {
    type: Date
  },
  breakStartTime: {
    type: Date
  },
  breakEndTime: {
    type: Date
  },
  afterBreakTime: {
    type: Date
  },
  clockOutTime: {
    type: Date
  },
  updateClockinTime:{
    type: Date
  },
  totalWorkTime: {
    type: String
  },
  totalBreakTime:{
    type: String
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'onBreak'],
    default: 'absent'
  },
},
{
  timestamps: true
});

employeeSchema.pre("save", async function (next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10)
  next();
})

employeeSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password)
}

employeeSchema.methods.generateToken = function (){
  return jwt.sign({_id : this._id}, process.env.JWT_SECRET, {
    expiresIn : "15d",
  })
}

module.exports = mongoose.model('Employee', employeeSchema);
