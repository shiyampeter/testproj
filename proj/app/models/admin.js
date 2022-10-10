const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, 'Email address is required'],
    },
    image: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })


schema.pre('save', function(next) {
    const admin = this;

    if (!admin.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(admin.password, salt, function(err, hash) {
            if (err) return next(err);
            admin.password = hash;
            next();
        });
    });
});

schema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = mongoose.model('Admin', schema);

module.exports = Admin 