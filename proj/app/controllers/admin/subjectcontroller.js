const Joi = require('joi');
const {subject} = require('../../models');
const {Response} = require('../../helpers');
const mongoose = require('mongoose');
const cors = require('cors');

//Post Method
const store = async(req,res,next) => {
    

    try {

        const schema=Joi.object({
            subname: Joi.string().min(3).required(),
            extypeid: Joi.objectId().required()
        });

        const { error, value } = schema.validate(req.body,{ abortEarly: false });

        if (error) {
            const validationErr = error.details.map(value => value.message);
            return res
                .status(400)
                .json(Response.error(validationErr, 'validation error'))
        }
        const data = new subject(value)

        const dataToSave = await data.save();
       // res.status(200).json(dataToSave)
        return res.json(Response.success(dataToSave))
        //res.json({success : true, message: "Updated Successfully", status : 200, data: dataToSave});
    }
    catch (error) {
        res.status(400).json(Response.error(error.message))
    }
}

const viewall = async(req,res,next) => {
    
    try{
        const data = await subject.find();
        res.json(Response.success(data))
    }
    catch(error){
        res.status(500).json(Response.error(error.message))
    }
}

const update = async(req,res,next) => {
    const schema=Joi.object({
        subname: Joi.string().min(3).required(),
        extypeid: Joi.objectId().required()
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

        const result = await subject.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(Response.success(result))
    }
    catch (error) {
        res.status(400).json(Response.error(error.message))
    }
}

const erase = async(req,res,next) => {
    try {
        const id = req.params.id;
        const data = await subject.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json(Response.error(error.message))
    }
    
}


//aggregate two tables
const viewaggregate = async(req,res,next) => {
    try{
        subject.aggregate([{
            $lookup:{
                from:"examtypes",
                localField:"extypeid",
                foreignField:"_id",
                as:"data"
            }
        }]).exec((err, result)=>{
            if (err) {
                res.json(Response.error(err.message))
            }
            if (result) {
                res.json(Response.success(result));
            }
        })
    }
    catch(error){
        res.status(500).json(Response.error(error.message))
    }
}


const viewone = async(req,res,next) => {
    
    try{
        const data = await subject.findById(req.params.id);
        res.json(Response.success(data))
        
    }
    catch(error){
        res.status(500).json(Response.error(error.message))
    }
}

module.exports = {viewall,store,update,erase,viewaggregate,viewone};

