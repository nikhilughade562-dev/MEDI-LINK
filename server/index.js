const express=require('express')
const dotenv=require('dotenv').config()
const cors=require('cors')
const connectDB=require('./config/db.js')
const connectCloudinary=require('./config/cloudinary.js')
const userRouter=require('./routes/userRoute.js')
const doctorRouter = require('./routes/doctorRoute.js')
const adminRouter = require('./routes/adminRoute.js')
const app=express()
const PORT=process.env.PORT || 4000

// app config 
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/admin",adminRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})