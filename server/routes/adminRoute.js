const { addDoctor,loginAdmin,allDoctors,}=require('../controller/adminController.js');
const express=require('express');
const adminRouter=express.Router();
const upload=require('../middleware/multer.js');
const authAdmin=require('../middleware/authAdmin.js');

adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);

module.exports=adminRouter;
