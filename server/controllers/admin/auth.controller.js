const passport = require('passport');

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err) return res.status(400).json(err);

        if (user) {
            if (user.role === process.env.ROLE_ADMIN) {
                return res.status(200).json({ "token": user.generateJwt() });
            }

            return res.status(401).send({ auth: false, message: 'Token authentication failed.' });
        }

        return res.status(404).json(info);
    })(req, res);
}


