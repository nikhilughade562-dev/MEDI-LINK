const express=require('express');
const {doctorList,loginDoctor,doctorProfile,updateDoctorProfile, doctorDashboard,appointmentComplete,appointmentsDoctor,appointmentCancel,uploadPrescription}=require('../controller/doctorController.js');
const authDoctor=require('../middleware/authDoctor.js');
const upload=require('../middleware/multer.js');

const doctorRouter=express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.post("/upload-prescription",authDoctor,upload.single("prescription"),uploadPrescription);

module.exports=doctorRouter;