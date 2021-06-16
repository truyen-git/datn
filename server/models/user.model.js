const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'Full name can\'t be empty'
    },
    email: {
        type: String,
        required: 'Email can\'t be empty',
        unique: true
    },
    password: {
        type: String,
       /* required: 'Password can\'t be empty',*/
        minlength: [4, 'Password must be at least 4 character long']
    },
    image:{
        type: String
    },
    googleProvider: {
      type: {
        id: String
      },
      select: false
    },
    money: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 0,
        required: true
    },
    saltSecret: String
});

// Custom validation for email
userSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

// Events
userSchema.pre('save', function (next) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret = salt;
            next();
        });
    });
});


// Methods
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
};


const userModel = mongoose.model('User', userSchema);

userModel.find({ email: "admin@admin.com" })
    .then(resp => {
        if (Array.isArray(resp)) {
            if (resp.length === 0) {
                userModel.create({
                    fullName: "Administrator",
                    email: "admin@admin.com",
                    role: 1,
                    password: 123456
                });
            }
        }
    });

module.exports = userModel;