
const Joi = require('joi');
const {student} = require('../../models');
const {Response} = require('../../helpers');
const mongoose = require('mongoose');
const cors = require('cors');



//Post Method
const store = async(req,res,next) => {
    

    try {

        const schema=Joi.object({
            name: Joi.string().min(3).required(),
            rno: Joi.number().required(),
            dept: Joi.string().min(3).required()
        });

        const { error, value } = schema.validate(req.body,{ abortEarly: false });

        if (error) {
            const validationErr = error.details.map(value => value.message);
            return res
                .status(400)
                .json(Response.error(validationErr, 'validation error'))
        }
        const data = new student(value)

        const dataToSave = await data.save();
       // res.status(200).json(dataToSave)
        return res.json(Response.success(dataToSave))
        //res.json({success : true, message: "Updated Successfully", status : 200, data: dataToSave});
    }
    catch (error) {
        res.status(400).json(Response.error(error.message))
    }
}

//Get all Method using skip and limit
const viewpage = async(req,res,next) => {
    try{
        var limit=req.query.limit;
        var page=req.query.page;
        
        if(req.query.page&&req.query.limit){
           
            const data = await student.find().limit(limit).skip((page-1)*limit).sort( {_id:-1} );
            count=data.length;
        
             res.json(Response.success({data,count}))
        }
        else{
            const data = await student.find();
            count=data.length;
            res.json(Response.success({data,count}));

        }
    }
    catch(error){
        res.status(500).json(Response.error(error.message))
    }
}
//Get all name starts with
const viewbyname = async(req,res,next) => {
    try{
        
        if((req.params.name!=undefined)&&(req.params.rno!=undefined))
        {
        
        const data = await student.find({name :  {$regex : `^${req.params.name}.*` , $options: 'i' },rno : req.params.rno});
        res.json(Response.success(data))}

        else if(req.params.name!=undefined)
        {
       
        const data = await student.find({name :  {$regex : `^${req.params.name}.*` , $options: 'i' }});
        res.json(Response.success(data))}

        else if(req.params.rno!=undefined)
        {
       
        const data = await student.find({rno : req.params.rno });
        res.json(Response.success(data))}
        else {

        const data = await student.find();
        res.json(Response.success(data))
        }
    }
    catch(error){
        res.status(500).json(Response.error(error.message))
    }
}

//Get by ID Method
const viewone = async(req,res,next) => {
    try{
        
        const data = await student.findById(req.params.id);
        res.json(Response.success(data))
    }
    catch(error){
        res.status(500).json(Response.error(error.message))
    }
}

//Update by ID Method
const update = async(req,res,next) => {

    const schema=Joi.object({
        name: Joi.string().min(3).required(),
        rno: Joi.number().required(),
        dept: Joi.string().min(3).required()
    });

    const { error, value } = schema.validate(req.body,{ abortEarly: false });

    if (error) {
        const validationErr = error.details.map(value => value.message);
        return res
            .status(400)
            .json(Response.error(validationErr, 'validation error'))
    }
    
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await student.findByIdAndUpdate(
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
        const data = await student.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json(Response.error(error.message))
    }
}
module.exports = {store,viewpage,viewbyname,update,erase,viewone};