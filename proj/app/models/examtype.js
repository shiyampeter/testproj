const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    extypename: {
        required: true,
        type: String
    },
    exid: {
        
        required: true,
        type: Number
    }
    
})

const examtype = mongoose.model('examtype', dataSchema);
module.exports = examtype