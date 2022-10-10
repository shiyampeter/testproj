const jwt = require('jsonwebtoken');
const Joi = require('joi');
const {Admin,ForgetPasswordAdmin} = require('../../models');
const {Response} = require('../../helpers');
const mongoose = require('mongoose');
const cors = require('cors');
const {transporter} = require('../../../config/mail');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotallySecretKey');


const login = async (req, res) => {
    const email = req.body['email']
    const password = req.body['password']

    if (!email || !password) {
        return res.status(400)
            .json(Response.error("Email and password is required"))
    }

    const admin = await Admin.findOne({ email }).exec()
    if (!admin) {
        return res.status(400)
            .json(Response.error("Email or password invalid"))
    }

    let isCorrect = await admin.comparePassword(password)
    if (!isCorrect) {
        return res.status(400)
            .json(Response.error("Email or password invalid"))
    }

    const expiresIn = process.env.JWT_EXPIRY;
    const token = jwt.sign({
        admin: admin
    }, process.env.JWT_SECRET, { expiresIn, subject: admin.id, audience: process.env.API_URL });
    return res.json(Response.success({token, expiresIn, admin }))
}

const getMe = async (req, res) => {
    const id = req['userId']

    try {
        const admin = await Admin.findById(id).exec()
        return res.json(Response.success({ admin }))
    } catch (e) {
        return res
            .status(400)
            .json(Response.error("Admin not found"))
    }
}

const register = async (req, res) => {

    try {

        const schema = Joi.object({
            name: Joi.string().min(2).required(),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            password: Joi.string().min(6).required(),
        });

        const { error, value } = schema.validate(req.body,{ abortEarly: false });

        if (error) {
            const validationErr = error.details.map(value => value.message);
            return res
                .status(400)
                .json(Response.error(validationErr, 'validation error'))
        }


        const adminExist = await Admin.findOne({ email: value.email }).exec()
        if (adminExist) {
            return res.status(400)
                .json(Response.error("Email Already exist"))
        }
       

       /* if (req.file){
            value.image=req.file.path
            
        }*/
        if(req.files){
            let path = ''
            req.files.forEach(function(files,index,arr){
                path=path+files.path+','
            })
            path=path.substring(0,path.lastIndexOf(","))
            value.image=path
        }
        const admin = new Admin(value)
        await admin.save()

        return res.json(Response.success(admin))
    } catch (e) {
        return res
            .status(400)
            .json(Response.error(e.message))
    }
}


const ForgetpasswordSend = async (req,res) =>
{  
    //console.log("hi");
    const schema = Joi.object(
        {
            email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
           
        },
    )
   
    const { error, value } = schema.validate(req.body,{ abortEarly: false });


    if (error) {
        const validationErr = error.details.map(value => value.message);
        return res
        .status(400)
        .json(Response.error(validationErr, 'validation error')) 
    }
    //console.log(value.email)
    await ForgetPasswordAdmin.deleteMany({ email:value.email });
    const AdminExist = await Admin.findOne(
        {
            email:value.email,
        }
    );
   
    if(!AdminExist)return res.status(400).json(Response.error("Admin Not Exist"));
    
    const forget_password_otp = Math.floor(1000 + Math.random() * 9000);
    const email = AdminExist.email;
    const forgetpassword = new ForgetPasswordAdmin();
    forgetpassword.email = email;
    forgetpassword.token = forget_password_otp;
    await forgetpassword.save();
    const encryptedString = cryptr.encrypt(forget_password_otp);
     const url='https://jobsnap.akdevtest.tk/auth/reset-password?token='+encryptedString+'&&email='+req.body.email
       transporter.verify(async function(error, success) {
          const mail= await transporter.sendMail({
            from: '"Aeroskop" <mytestpetershiyam@gmail.com>', // sender address
            to: 'toPersonName <shiyampeter@gmail.com>', // list of receivers
            subject: "STUDENT INFORMATION", // Subject line
            text: "Student Data", // plain text body
            html: `Click <a href ='${url}'>here</a> to reset your password.`
          })
          if(error){
        console.log(error);
    } else {    
        console.log('Server is ready for messages');
    }

   });
    res.status(200).json(Response.success(forgetpassword,"Password link sent to mail"))

}

const ForgetPasswordVerify = async (req,res) =>
{
    const schema = Joi.object(
        {
            email : Joi.string().required(),
            forget_password_otp:Joi.string().required(),
            newpassword:Joi.string().min(6).required(),
        },
    )
   
    const { error, value } = schema.validate(req.body,{ abortEarly: false });


    if (error) {
        const validationErr = error.details.map(value => value.message);
        return res
        .status(400)
        .json(Response.error(validationErr, 'validation error')) 
    }
     const otp_data = cryptr.decrypt(value.forget_password_otp);
    const AdminExist = await Admin.findOne(
        {
            email:value.email,
        }
    );

    if(!AdminExist)return res.status(400).json(Response.error("Email Wrong Credentials"));
    const PasswordExist = await ForgetPasswordAdmin.findOne(
        {
            email:value.email,
        }
    )
    
    var newpasswordcheck = false;
    if(!PasswordExist) return res.status(400).json(Response.error("Response timed out"));
    if(PasswordExist.token!=otp_data) return res.status(500).json((Response.error("Wrong OTP")));
    newpasswordcheck = await AdminExist.comparePassword(value.newpassword);
    if(newpasswordcheck) return res.status(500).json((Response.error("Newpassword can't be old password")));
    bcrypt.genSalt(saltRounds, async function(err, salt) {
        if(err) res.send(err);
         bcrypt.hash(value.newpassword, salt, async function(err, hash) {
            
            if(err)
            {
                res.json(Response.error(err))
            }
            await Admin.updateOne({email:value.email},{$set:{password:hash}});
          
            res.status(200).json(Response.success(null,"Password Changed Successfully"));
            await ForgetPasswordAdmin.deleteMany({ email:value.email });
        });
    });
}

module.exports = {
    login,
    getMe,
    register,
    ForgetpasswordSend,
    ForgetPasswordVerify
    
}


