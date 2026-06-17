const userModel = require("../models/userModel.js");
const doctorModel = require("../models/doctorModel.js");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const validator = require("validator");
const dotenv = require("dotenv").config();
const appointmentModel = require("../models/appointmentModel.js");
const transporter = require("../config/mailer.js");

//API for user registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // email validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" });
    }
    // password validation
    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" });
    }

    // password hashing
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    //saving new user
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // toekn generation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API ofr fetching User Profile
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    //getting user data and excluding password
    const useData = await userModel.findById(userId).select("-password");
    res.json({ success: true, user: useData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: address,
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API for booking appointment
const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    // checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    //sending appointment confimation mail to user email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: userData.email,

      subject: "MEDILINK - Appointment Confirmation",

      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden;">
      
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">MEDILINK</h1>
      </div>

      <div style="padding: 30px; color: #333;">
        <h2>Hello ${userData.name},</h2>

        <p>
          Your appointment has been <strong>successfully booked</strong>. Here are your appointment details:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; font-weight: bold;"> Doctor</td>
            <td style="padding: 10px;">Dr. ${docData.name}</td>
          </tr>

          <tr style="background-color: #f8f8f8;">
            <td style="padding: 10px; font-weight: bold;"> Date</td>
            <td style="padding: 10px;">${slotDate}</td>
          </tr>

          <tr>
            <td style="padding: 10px; font-weight: bold;"> Time</td>
            <td style="padding: 10px;">${slotTime}</td>
          </tr>

          <tr style="background-color: #f8f8f8;">
            <td style="padding: 10px; font-weight: bold;"> Consultation Fee</td>
            <td style="padding: 10px;">₹${docData.fees}</td>
          </tr>
        </table>

        <p>
          Please arrive <strong>10-15 minutes before</strong> your scheduled appointment.
        </p>

        <p>
          Thank you for choosing <strong>MEDILINK</strong>. We wish you good health!
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>Team MEDILINK</strong>
        </p>
      </div>

      <div style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #666;">
        This is an automated email. Please do not reply to this message.
      </div>

    </div>
  `,
    });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//cancelling appointment
const cancelAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime,
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    //sending appointment confimation mail to user email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: userData.email,

      subject: "MEDILINK - Appointment Cancellation",

      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e5e5; border-radius: 10px; overflow: hidden;">
      
      <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">MEDILINK</h1>
      </div>

      <div style="padding: 30px; color: #333;">
        <h2>Hello ${userData.name},</h2>

        <p>Below are the details of the cancelled appointment:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; font-weight: bold;"> Doctor</td>
            <td style="padding: 10px;">${docData.name}</td>
          </tr>

          <tr style="background-color: #f8f8f8;">
            <td style="padding: 10px; font-weight: bold;"> Date</td>
            <td style="padding: 10px;">${slotDate}</td>
          </tr>

          <tr>
            <td style="padding: 10px; font-weight: bold;"> Time</td>
            <td style="padding: 10px;">${slotTime}</td>
          </tr>

          <tr style="background-color: #f8f8f8;">
            <td style="padding: 10px; font-weight: bold;"> Consultation Fee</td>
            <td style="padding: 10px;">$${docData.fees}</td>
          </tr>
        </table>

       <p>
          If this cancellation was made by mistake or you'd like to book another appointment,
          you can do so anytime through <strong>MEDILINK</strong>.
        </p>

        <p>
          We look forward to serving you in the future.
        </p>

        <br>

        <p>
          Regards,<br>
          <strong>Team MEDILINK</strong>
        </p>
      </div>

      <div style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #666;">
        This is an automated email. Please do not reply to this message.
      </div>

    </div>
  `,
    });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments
const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
};
