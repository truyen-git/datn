'use strict';

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

function auth(req, res, next) {
    var token;
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];

    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            async (err, user) => {
                if (err)
                    return res.status(500).send({ auth: false, message: 'Token authentication failed.' });

                var userRole = 0;
                await User.findById(user._id).then(resp => {
                    userRole = resp.role;
                });

                if (userRole === process.env.ROLE_ADMIN) {
                    return next();
                }

                return res.status(401).send({ auth: false, message: 'Token authentication failed.' });
            }
        )
    }
}

module.exports = auth;