const express=require('express')
const dotenv=require('dotenv').config()
const cors=require('cors')
const connectDB=require('./config/db.js')
const connectCloudinary=require('./config/cloudinary.js')
const userRouter=require('./routes/userRoute.js')
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



app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})