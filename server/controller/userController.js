const userModel = require("../models/userModel.js");
const doctorModel = require("../models/doctorModel.js");
const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
const validator = require("validator");
const dotenv = require("dotenv").config();
const appointmentModel = require("../models/appointmentModel.js");
const razorpay = require("razorpay");

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

  res.json({
  success: true,
  message: "Appointment Booked Successfully",
});
    
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

     if (appointmentData.cancelled) {
    return res.json({
        success: false,
        message: "Appointment already cancelled"
    });
  }

    // verify appointment user
    if (String(appointmentData.userId) !== String(userId)) {
      return res.json({ success: false, message: "Unauthorized action" });
    }


    let refundData = null;
        if (appointmentData.payment) {

            // Check payment ID exists
            if (!appointmentData.razorpayPaymentId) {

                return res.json({
                    success: false,
                    message: "Payment ID not found"
                });
            }

            refundData =
                await razorpayInstance.payments.refund(
                    appointmentData.razorpayPaymentId,
                    {
                        amount: appointmentData.amount * 100
                    }
                );

            await appointmentModel.findByIdAndUpdate(
                appointmentId,
                {
                    refundId: refundData.id,
                    refundStatus: refundData.status
                }
            );
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

    res.json({ success: true, message: "Appointment Cancelled and Refund Within 5-7 days" });
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

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Api to make payement for appoitment using razorpay
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or Not Found",
      });
    }
    // creating option for razor pay
    const options = {
      amount: appointmentData.amount*100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // creating order for razor pay
    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay=async (req,res)=>{
    try {
      const {razorpay_order_id,razorpay_payment_id}=req.body;
      const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id);

      if(orderInfo.status=='paid'){
         await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true,razorpayPaymentId: razorpay_payment_id})
         res.json({success:true,message:"Payment Successful"});
      }
      else{
        res.json({success:false,message:"Payment Failed"});
      }

    } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay
};
