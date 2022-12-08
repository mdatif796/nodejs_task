const jwt = require('jsonwebtoken');
const User = require('../models/user');
const mailer = require('../config/nodemailer');
const Token = require('../models/token');
const crypto = require('crypto');

module.exports.signUp = async (req, res) => {
    try {
        let userByEmail = await User.findOne({email: req.body.email});
        // console.log('req.body: ', req.body);
        // console.log('userByEmail: ', userByEmail);
        if(userByEmail){
            return res.status(401).json({
                message: 'email already registered'
            });
        }
    
        let userByUserName = await User.findOne({userName: req.body.userName});
        if(userByUserName){
            return res.status(401).json({
                message: 'username already exists'
            });
        }
    
        let user = await User.create(req.body);
        if(user){
            return res.status(200).json({
                message: 'user created successfully',
                user: user
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Error in signing up the user',
            error: error
        });
    }
}


module.exports.logIn = async (req, res) => {
    try {
        let user = await User.findOne({username: req.body.username});
        if(!user){
            return res.status(401).json({
                message: 'email | password does not match'
            });
        }

        if(user.password !== req.body.password){
            return res.status(401).json({
                message: 'email | password does not match'
            });
        }
    
        return res.status(200).json({
            message: 'user logged in successfully',
            token: jwt.sign(user.toJSON(), process.env.JWTSECRETKEY, {expiresIn: '1h'})
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error
        });
    }
}

module.exports.passwordResetLink = async (req, res) => {
    try {
        let user = await User.findOne({username: req.body.username});
        if(!user){
            return res.status(401).json({
                message: 'user not exist'
            });
        }
    
        let token = await Token.findOne({userId: user._id});
        if(!token){
            token = await Token.create({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex")
            });
        }
        let link = `http://localhost:3000/api/password-reset/${user._id}/${token.token}`;
        await mailer.sendEmail(user.email, link);
        return res.status(200).json({
            message: 'Password reset link sent successfully on email'
        });
    } catch (error) {
        console.log('error: ', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error
        });
    }
}

module.exports.passwordReset = async (req, res) => {
    try {
        let userId = req.params.userId;
        let user = await User.findById(userId);
        if(!user){
            return res.status(401).json({
                message: 'Link expired'
            });
        }
    
        let token = await Token.findOne({
            userId: userId,
            token: req.params.token
        });
    
        if(!token){
            return res.status(401).json({
                message: 'Link expired'
            });
        }
    
        user.password = req.body.password;
        await user.save();
        await token.delete();
        return res.status(200).json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}