const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const schema =  new  mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
        },
        token:
        {
            type:Number,
        },
        expire_at: {type: Date, default: Date.now, expires: 600} 
    },{ timestamps: true }
);
const ForgetPasswordAdmin = mongoose.model('ForgetPasswordAdmin',schema);
module.exports= ForgetPasswordAdmin;