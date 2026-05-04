const express=require('express');
const userRouter=express.Router();
const authUser=require('../middleware/authUser.js')
const {registerUser,loginUser,getProfile,updateProfile}=require('../controller/userController.js');
const upload=require('../middleware/multer.js')

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("image"),
  authUser,
  updateProfile
);

module.exports=userRouter;