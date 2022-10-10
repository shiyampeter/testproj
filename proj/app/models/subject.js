const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    subname: {
        required: true,
        type: String
    },
    extypeid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'examtype'
    }
})
const subject=mongoose.model('subject', dataSchema);
module.exports = subject