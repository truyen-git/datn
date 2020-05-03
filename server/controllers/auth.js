const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/user.model');
const passwordResetToken = require('../models/resettoken');
module.exports = {
  
  async ResetPassword(req, res) {
    if (!req.body.email) {
      return res
      .status(500)
      .json({ message: 'Email is required' });
    }
    const user = await User.findOne({
      email:req.body.email
    });
    if (!user) {
      return res
      .status(409)
      .json({ message: 'Email does not exist' });
    }
    var resettoken = new passwordResetToken({ _userId: user._id, resettoken: crypto.randomBytes(16).toString('hex') });
    resettoken.save(function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }
      passwordResetToken.find({ _userId: user._id, resettoken: { $ne: resettoken.resettoken } }).remove().exec();
      res.status(200).json({ message: 'Reset Password successfully.' });
      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'Gmail',
        port: 465,
        auth: {
          user: 'user',
          pass: 'password'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'Truyentien97@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://localhost:4200/response-reset-password/' + resettoken.resettoken + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      }
      transporter.sendMail(mailOptions, (err, info) => {
      })
    })
  },

  async ValidPasswordToken(req, res) {
    if (!req.body.resettoken) {
      return res
      .status(500)
      .json({ message: 'Token is required' });
    }
    const user = await passwordResetToken.findOne({
      resettoken: req.body.resettoken
    });
    if (!user) {
      return res
      .status(409)
      .json({ message: 'Invalid URL' });
    }
    User.findOneAndUpdate({ _id: user._userId }).then(() => {
      res.status(200).json({ message: 'Token verified successfully.' });
    }).catch((err) => {
      return res.status(500).send({ msg: err.message });
    });
  },
  async NewPassword(req, res) {
    passwordResetToken.findOne({ resettoken: req.body.resettoken }, function (err, userToken, next) {
      if (!userToken) {
        return res
        .status(409)
        .json({ message: 'Token has expired' });
      }

      User.findOne({
        _id: userToken._userId
      }, function (err, userEmail, next) {
        if (!userEmail) {
          return res
          .status(409)
          .json({ message: 'User does not exist' });
        }
        return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
          if (err) {
            return res
            .status(400)
            .json({ message: 'Error hashing password' });
          }
          userEmail.password = hash;
          userEmail.save(function (err) {
            if (err) {
              return res
              .status(400)
              .json({ message: 'Password can not reset.' });
            } else {
              userToken.remove();
              return res
              .status(201)
              .json({ message: 'Password reset successfully' });
            }

          });
        });
      });

    })
  }
}