const doctorModel=require('../models/doctorModel.js');
const dotenv=require('dotenv').config()
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const appointmentModel=require('../models/appointmentModel.js');
const cloudinary=require('cloudinary');


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

    const isMatch = await bcrypt.compare(password, doctor.password);

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
    const docId  = req.docId;
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
    const docId=req.docId;
    const { fees, address, available } = req.body;
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
    const docId  = req.docId;
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

// API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;

    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];

    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
  try {
    const docId = req.docId;
    const {appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      return res.json({ success: true, message: "Appointment Completed" });
    } else {
      return res.json({ success: false, message: "Mark Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
  try {
    const docId = req.docId;
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      return res.json({ success: true, message: "Appointment Cancelled" });
    } else {
      return res.json({ success: false, message: "Cancellation Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const uploadPrescription=async(req,res)=>{
  try {
    const {appointmentId}=req.body;
    const pdfFile=req.file;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }
    const pdfUpload=await cloudinary.uploader.upload(pdfFile.path,{resource_type:"raw",});

    const pdfUrl=pdfUpload.secure_url;

    const appointment = await appointmentModel.findByIdAndUpdate(
            appointmentId,
            { prescription: pdfUrl},
            { new: true }
    );

    return res.json({ success: true, message: "Appointment Uploaded Successfully" });
    
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

module.exports={
    changeAvailability,
    doctorList,
    loginDoctor,
    doctorProfile,
    updateDoctorProfile,
    doctorDashboard,
    appointmentComplete,
    appointmentsDoctor,
    appointmentCancel,
    uploadPrescription,
}