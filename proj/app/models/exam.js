const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    extypeid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'examtype'
    },
    subid: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject'
    },
    studid: {
        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student'
    },
    mark: {
        
        type: Number,
        required:true
    }
    
},{timestamps:true})

const exam = mongoose.model('exam', dataSchema);
module.exports = exam