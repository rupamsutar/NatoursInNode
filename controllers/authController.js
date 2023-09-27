const {promisify} = require('util');
const jwt = require("jsonwebtoken");
const User = require("./../models/userModal");
const catchAsync = require("./../utils/catchAsync");
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        name: req.body.email,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
})

exports.login = catchAsync(async(req, res, next) => {
    const {email, password } = req.body;

    // 1) check if  the email and password exist;
    if(!email || !password) {
        return next(new AppError('Please provide email ID and Password', 400));
    }

    // 2) Check if the users exist and password is correct
    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect Email or Password', 401));
    }

    // 3) If Everything OK send token to the client
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token
    })
});

exports.protect = catchAsync( async(req, res, next) => {
    // 1) Getting the token and checking if its there..
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if(!token) {
        return next(new AppError('You are not logged in ! Please log in to get access', 401));
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if user still exists
    const freshUser = await User.findById(decoded.id);

    if(!freshUser) {
       return next(new AppError('The user belonging to this token does no longer exist', 401));
    }

    // 4) check if user changed password after the token was issued.
    next();
})