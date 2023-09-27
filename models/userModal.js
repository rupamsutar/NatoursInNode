const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email !'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email ID']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Password is mandatory'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Kindly fill confirm your password'],
        validate: {
            // This only works on save and create !
            validator: function(el) {
                return el === this.password;
            }
        },
        select: false
    }
});

userSchema.pre('save', async function(next) {
    // Only run the function if the password was actually modified
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);
module.exports = User;