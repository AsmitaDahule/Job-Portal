import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";


// User Registration
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User with this email already exists",
        success: false,
      });
    }

    // convert password to hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    // create new user
    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        _id: savedUser._id,
        fullname: savedUser.fullname,
        email: savedUser.email,
        phoneNumber: savedUser.phoneNumber,
        role: savedUser.role,
      },
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Server error register',
      success: false,
    });
  }
};


// User Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }
    // find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    // check role
    if (user.role !== role) {
      return res.status(400).json({
        message: `User is not registered as a ${role}`,
        success: false,
      });
    }

    // generate token 
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 

    user = {
      _id: user._id,
      fullname: user.fullname,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      profile: user.profile,
    }

    // login successful
    return res.status(200).cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
    }).json({
      message: `Welcome back, ${user.fullname}`,
      user,
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error login',
      success: false,
    });
  }
};


// user logout
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie('token', '', {
      maxAge: 0
    }).json({
      message: 'Logged out successfully',
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error logout',
      success: false,
    });
  }
};

// update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.files;
    if (!fullname || !email || !phoneNumber || !bio || !skills) {
      return res.status(400).json({
        message: "Full name, email and phone number are required",
        success: false,
      });
    }

    // cloudinary upload








    const skillsArray = Array.isArray(skills) ? skills : skills.split(',');
    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.fullname = fullname;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.profile.bio = bio;
    user.profile.skills = skillsArray;

    // resume
    await user.save();        

    user = {
      _id: user._id,
      fullname: user.fullname,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error update profile',
      success: false,
    });
  }

};