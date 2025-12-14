import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullname:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  phoneNumber:{
    type:Number,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    enum:["Student", "Recruiter"],
    default:"Student",
    required:true,
  },
  profile:{
    bio:{
      type:String,
    },
    skills:[
      {
        type:String,  // list of skills
      }
    ],
    resume:{
      type:String,  // url to resume file
    },
    resumeOriginalname:{
      type:String,  // original file name of the resume
    },
    company:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'Company',
    },
    profilePhoto:{
      type:String,  // url to profile photo
      default:'',
    },
  },
},{ timestamps: true });

export default mongoose.model('User', userSchema);
