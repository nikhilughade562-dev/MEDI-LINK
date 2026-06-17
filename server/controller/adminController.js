const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userModel=require('../models/userModel.js');
const doctorModel=require('../models/doctorModel.js');
const appointmentModel=require('../models/appointmentModel.js')
const cloudinary=require('cloudinary');
const dotenv=require('dotenv').config();
const validator=require('validator');
const transporter = require("../config/mailer.js");

//admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // checking for all data to add doctor
    if (
      !name ||!email ||!password ||!speciality ||!degree ||!experience || !about || !fees || !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing doctor password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    // Send onboarding email
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: "Welcome to MEDILINK - Your Doctor Account is Ready",

  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden;">

      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1 style="margin:0;">MEDILINK</h1>
      </div>

      <div style="padding:30px; color:#333;">
        <h2>Hello Dr. ${name},</h2>

        <p>
          Congratulations! You have been successfully onboarded as a doctor on
          <strong>MEDILINK</strong>.
        </p>

        <p>Your account has been created with the following login credentials:</p>

        <table style="width:100%; border-collapse:collapse; margin:20px 0;">
          <tr style="background:#f8f8f8;">
            <td style="padding:10px; font-weight:bold;">Email</td>
            <td style="padding:10px;">${email}</td>
          </tr>

          <tr>
            <td style="padding:10px; font-weight:bold;">Password</td>
            <td style="padding:10px;">${password}</td>
          </tr>

          <tr style="background:#f8f8f8;">
            <td style="padding:10px; font-weight:bold;">Speciality</td>
            <td style="padding:10px;">${speciality}</td>
          </tr>

          <tr>
            <td style="padding:10px; font-weight:bold;">Experience</td>
            <td style="padding:10px;">${experience}</td>
          </tr>
        </table>

        <p>
          You can now log in to your MEDILINK Doctor Dashboard using the above
          credentials.
        </p>

        <div style="background:#eff6ff; border-left:4px solid #2563eb; padding:15px; margin:20px 0;">
          <strong>Security Recommendation:</strong><br>
          Please change your password after your first login to keep your account secure.
        </div>

        <p>
          We are excited to have you on board and look forward to helping you
          provide excellent healthcare services.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>Team MEDILINK</strong>
        </p>
      </div>

      <div style="background:#f3f4f6; text-align:center; padding:15px; font-size:12px; color:#666;">
        This is an automated email. Please do not reply to this message.
      </div>

    </div>
  `,
});

    
    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get all doctor
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    console.log(appointments)
    res.json({ success: true, appointments });
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports={
    addDoctor,
    loginAdmin,
    allDoctors,
    appointmentsAdmin,
    adminDashboard,
    appointmentCancel
}