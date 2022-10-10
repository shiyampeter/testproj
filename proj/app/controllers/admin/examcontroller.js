const Joi = require('joi');
const {exam} = require('../../models');
const {Response} = require('../../helpers');
const mongoose = require('mongoose');
const cors = require('cors');
Joi.objectId = require('joi-objectid')(Joi);


const nodemailer = require("nodemailer");
const {google} = require('googleapis');
const path = require('path');

const Hogan =require('hogan.js');
const fs = require('fs');
var template = fs.readFileSync('./views/index.hjs','utf-8');
var compiledTemplate=Hogan.compile(template);
//const hbs = require('nodemailer-express-handlebars');
const CLIENT_ID = '311600023632-ukcpltp1n3jagaaa19q8nsgrhs4v1ltn.apps.googleusercontent.com'
const CLIENT_SECRET =  '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04dHmsQdDIa07CgYIARAAGAQSNwF-L9Ir9PJhtn2Mve1vrwBtxXJNtCT0Qmc2VfBmvUNtPZWDCBCvT7zzD6kEmqdT6KKIFxr10ZI'
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
const rono=10
//Post Method 
const store = async(req,res,next) => {
    

    try {
        
        const schema=Joi.object({
            extypeid: Joi.objectId().required(),
            subid: Joi.objectId().required(),
            studid: Joi.objectId().required(),
            mark: Joi.number().required()
        
        });

        const { error, value } = schema.validate(req.body,{ abortEarly: false });

        if (error) {
            const validationErr = error.details.map(value => value.message);
            return res
                .status(400)
                .json(Response.error(validationErr, 'validation error'))
        }
        const data = new exam(value)

        const dataToSave = await data.save();
       // res.status(200).json(dataToSave)
        return res.json(Response.success(dataToSave))
        //res.json({success : true, message: "Updated Successfully", status : 200, data: dataToSave});
    }
    catch (error) {
        res.status(400).json(Response.error(error.message))
    }
}


//Get all Method
const viewall = async(req,res,next) => {
    try{
        const data = await exam.find();
        res.json(Response.success(data))
    }
    catch(error){
        res.status(500).json(Response.error(error.message))
    }
}

//Get by two id's Method
//router.get('/getResult/:stid/:exid', async (req, res) => {
//router.get('/getResult', async (req, res) => {
 const viewdetail = async(req,res,next) => {
    try{
       
        const data = await exam.find({studid:req.params.stid,extypeid:req.params.exid});
        var total=0;
        for (i=0; i<data.length; i++){
        
            total+=data[i].mark;
        }




      exam.aggregate([

      { $match : { "studid" : mongoose.Types.ObjectId(req.params.stid) } },
           /* {$lookup:{
                from:"students",
                let : {"id": "_id"},
                pipeline: [
                    {
                        $match: {
                            "$expr":  {"$eq": ["$studid","$req.params.stid"]}
                                
                            }
                        }
                    
                ],
                as:"studentdata"
            }},
            {
                $unwind: "$studentdata"
            },*/
            

            { $lookup:{
                from:"examtypes",
                localField:"extypeid",
                foreignField:"_id",
                as:"examtypedata"
            }},

            {
                $unwind: "$examtypedata"
            },


              { $lookup:{
                    from:"students",
                    localField:"studid",
                    foreignField:"_id",
                    as:"studentdata"
                }},
                {
                    $unwind: "$studentdata"
                },
                
               // { $match : { "studentdata._id" : req.params.stid } },
            
                    { $lookup:{
                        from:"subjects",
                        localField:"subid",
                        foreignField:"_id",
                        as:"subjectdata"
                    }},

                    {
                        $unwind: "$subjectdata"
                    }
                
     ]).exec((err, result)=>{
            if (err) {
                res.json("error" ,err)
            }
            if (result) {
                var gradeca ={90 : "O" , 80 : "A+", 70 : "A" ,60 : "B+",50 : "B", 0 : "U"};
                var grade="grade";
                var sid=req.params.stid;
                var eid=req.params.exid;
                var submarks=new Object();
                var x=0;
                //var submarks = [];
                var totalmark=0;
               for(var i=0;i<result.length;i++){
                    if(result[i].studid==sid){
                        var sname=result[i].studentdata.name;
                        var rno=result[i].studentdata.rno;
                        var dept=result[i].studentdata.dept;
                    }
                    if(result[i].extypeid==eid){
                        var etype=result[i].examtypedata.extypename;
                    }
                    if((result[i].studid==sid)&(result[i].extypeid==eid)){
                       
                        var grades;
                        var t;
                        var it=new Object();
                        var y=result[i].subjectdata.subname;
                        z= result[i].mark;
                        it[y]=z;
                    
                        t=(Math. floor(z/10))*10;
                        grades=gradeca[t];
                        it[grade]=grades;
                        submarks[y]=it;
                        totalmark=totalmark+result[i].mark;
                        x=x+1;
                    }

               }
               var PDFDocument = require('pdfkit');
            
               const doc = new PDFDocument();
               doc.pipe(fs.createWriteStream('output.pdf'));
               //var a=5;
              // var json = {studentname:sname,Rollno:rno,department:dept,Examtype:etype,subjectmarks:submarks,Totalmarks:totalmark,length : result.length}
               doc.fontSize(15)
                   .fillColor('blue')
                   .text("STUDENT DATA")
                   .text("Name = "+sname)
                   .text("Roll No = "+rno)
                   .text("Department = "+dept)
                   .text("ExamType = "+etype)
                   .text("Total Mark = "+totalmark)

                  // .text(JSON.stringify(json, null, 2), 100, 100)
               // .link(100, 100, 160, 27, link);
           
              // doc.pipe(res);
           
               doc.end();    
                    
               const accesstoken = oAuth2Client.getAccessToken()
               let transporter = nodemailer.createTransport({
                   service: "gmail",
                   auth: {
                     type:'OAUTH2',
                     user: 'mytestpetershiyam@gmail.com', 
                     clientId: CLIENT_ID,
                     clientSecret : CLIENT_SECRET,
                     refreshToken : REFRESH_TOKEN,
                     accessToken : accesstoken
                   }
                 });
         
                 /*transporter.use('compile',hbs({
                   viewEngine : 'express-handlebars',
                   viewPath : './views/'
         
                 }));*/
                      
               var compose = {
                   from: '"Aeroskop" <mytestpetershiyam@gmail.com>', // sender address
                   to: 'toPersonName <shiyampeter@gmail.com>', // list of receivers
                   subject: "STUDENT INFORMATION", // Subject line
                   text: "Student Data", // plain text body
                   html : compiledTemplate.render({name:sname,rno:rno}),
                   attachments: [
                    {
                        filename: 'output.pdf',      
                        path: path.join(__dirname, '../../../output.pdf'),                                   
                        contentType: 'application/pdf'
                    }]
                   /*html: `<h3>Username : ${user.email}</h3><br><h3>Password : ${retVal}</h3><br>
                           <b>to login click www.google.com</b>`, // html body*/
                
           
           
               }
           
               transporter.sendMail(compose,(error,info) => {
                   if(error){
                       console.log(error)
                   }
                   else{
                       console.log("success")
                   }
               })
             
              
               
                res.json({data : result,y:y,total:total,studentname:sname,Rollno:rno,department:dept,Examtype:etype,subjectmarks:submarks,Totalmarks:totalmark,length : result.length});
                
            }

      });
       
           
        
    
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}
//Get by ID Method
const viewone = async(req,res,next) => {
    try{
        const data = await exam.findById(req.params.id);
        res.json(Response.success(data))
    }
    catch(error){
        res.status(500).json(Response.error(error.message))
    }
}

//Update by ID Method
const update = async(req,res,next) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await exam.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(Response.success(result))
    }
    catch (error) {
        res.status(400).json(Response.error(error.message))
    }
}

//Delete by ID Method
const erase = async(req,res,next) => {
    try {
        const id = req.params.id;
        const data = await exam.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json(Response.error(error.message))
    }
}
module.exports = {viewall,store,update,erase,viewone,viewdetail};