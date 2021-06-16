const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {OAuth2Client} = require('google-auth-library');
const { use } = require('passport');
const CLIENT_ID = '921406465241-inujav2ovvtv9rl2e56t652iqk6a919p.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);


module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.signInGoogle = async (req, res, next) => {
    const tokenId = req.body.tokenId;
    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: '921406465241-7h2kisp6v9dv804the6i2h2f67kfm2l5.apps.googleusercontent.com',
        });
        const ggEmail = ticket.payload.email;
        if (ggEmail) {
            const existUser = await User.findOne({ email: ggEmail});
            if (existUser) {
                return res.status(200).json({ "token": existUser.generateJwt()});
            } else {
                const user = new User();
                user.fullName = ticket.payload.name;
                user.email = ggEmail;
                user.password = "a,ndmn,n,sdasdfam";
                user.image = ticket.payload.photoUrl;
                // user.googleProvider.id = ticket.payload.sub;
                try {
                    const savedUser = await user.save();
                    return res.status(200).json({ "token": savedUser.generateJwt()});
                } catch (error) {
                    return res.status(400).json(error);
                }
            }
        }
    } catch (error) {
        return res.status(400).json(error);
    }
}


module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) });
        }
    );
}



