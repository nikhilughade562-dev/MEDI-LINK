const express=require('express');
const authUser=require('../middleware/authUser.js')
const {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}=require('../controller/userController.js');
const upload=require('../middleware/multer.js')

const userRouter=express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay",authUser,paymentRazorpay);
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay);

module.exports=userRouter;