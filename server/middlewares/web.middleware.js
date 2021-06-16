'use strict';

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    var token;
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];

    if (!token)
        return next();
    else {
        jwt.verify(token, process.env.JWT_SECRET,
            (err, user) => {
                if (err)
                    return next();

                req._id = user._id;
                next();
            }
        )
    }
}

module.exports = auth;