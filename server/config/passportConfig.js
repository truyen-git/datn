const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const mongoose = require('mongoose');

var User = mongoose.model('User');

passport.use(
    new localStrategy({ usernameField: 'email' },
        (username, password, done) => {
            User.findOne({ email: username },
                (err, user) => {
                    if (err)
                        return done(err);
                    // unknown user
                    else if (!user)
                        return done(null, false, { message: 'Email is not registered' });
                    // wrong password
                    else if (!user.verifyPassword(password))
                        return done(null, false, { message: 'Wrong password.' });
                    // authentication succeeded
                    else
                        return done(null, user);
                });
        })
);

passport.use(new FacebookTokenStrategy({
  clientID: '2412390069072934',
  clientSecret: 'dca253187e9b89e6741e3c7ab1ddae96'
},
function (accessToken, refreshToken, profile, done) {
  User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
    return done(err, user);
});
}));