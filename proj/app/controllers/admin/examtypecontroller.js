const Joi = require('joi');
const {examtype} = require('../../models');
const {Response} = require('../../helpers');
const mongoose = require('mongoose');
const cors = require('cors');


//Post Method
const store = async(req,res,next) => {
    

    try {

        
        const schema=Joi.object({
            extypename: Joi.string().min(3).required(),
            exid: Joi.number().required()
        });

        const { error, value } = schema.validate(req.body,{ abortEarly: false });

        if (error) {
            const validationErr = error.details.map(value => value.message);
            return res
                .status(400)
                .json(Response.error(validationErr, 'validation error'))
        }
        const data = new examtype(value)

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
        const data = await examtype.find();
        res.json(Response.success(data))
    }
    catch(error){
        res.status(400).json(Response.error(error.message))
    }
}
//Get by ID Method
const viewone = async(req,res,next) => {
    try{
        const data = await examtype.findById(req.params.id);
        res.json(Response.success(data))
    }
    catch(error){
        res.status(400).json(Response.error(error.message))
    }
}

//Update by ID Method
const update = async(req,res,next) => {
    const schema=Joi.object({
        extypename: Joi.string().min(3).required(),
        exid: Joi.number().required()
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

        const result = await examtype.findByIdAndUpdate(
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
        const data = await examtype.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json(Response.error(error.message))
    }
}
module.exports = {viewall,store,update,erase,viewone};
