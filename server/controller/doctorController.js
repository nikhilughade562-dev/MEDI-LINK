const doctorModel=require('../models/doctorModel.js');
const dotenv=require('dotenv').config()
const bycrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


//get all doctor
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select(["-password", "-email"]);

    res.json({ success: true, doctors });
  } 
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Doctor login
const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bycrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } 
    else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } 
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Doctor profile
const doctorProfile = async (req, res) => {
  try {
    const { docId } = req.body;
    const profileData = await doctorModel.findById(docId).select("-password");

    res.json({ success: true, profileData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { docId, fees, address, available } = req.body;
    await doctorModel.findByIdAndUpdate(docId, { fees, address, available });

    res.json({ success: true, message: "Profile Updated" });
  } 
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// change avalibility
const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.json({ success: true, message: "Availability changed" });
  } 
  catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports={
    changeAvailability,
    doctorList,
    loginDoctor,
    doctorProfile,
    updateDoctorProfile,
}