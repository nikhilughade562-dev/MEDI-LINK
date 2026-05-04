const userModel=require('../models/userModel.js')
const bycrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const cloudinary=require('cloudinary')
const validator=require('validator')
const dotenv=require('dotenv').config()

const registerUser=async (req,res)=>{
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
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


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
    } 
    else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    //getting user data and excluding password
    const useData = await userModel.findById(userId).select("-password");
    res.json({ success: true, user: useData });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address:address,
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

module.exports={
    registerUser,
    loginUser,
    getProfile,
    updateProfile}