const express=require('express');
const { addDoctor,loginAdmin,allDoctors,appointmentCancel,appointmentsAdmin,adminDashboard}=require('../controller/adminController.js');
const upload=require('../middleware/multer.js');
const authAdmin=require('../middleware/authAdmin.js');
const  {changeAvailability}=require('../controller/doctorController.js') ;

const adminRouter=express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.post("/change-availability", authAdmin, changeAvailability);


module.exports=adminRouter;
