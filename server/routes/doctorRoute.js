const express=require('express');
const {changeAvailability,doctorList,loginDoctor,doctorProfile,updateDoctorProfile,}=require('../controller/doctorController.js');
const authDoctor=require('../middleware/authDoctor.js');

const doctorRouter=express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

module.exports=doctorRouter;