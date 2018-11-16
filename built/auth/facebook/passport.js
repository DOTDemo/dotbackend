"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport = require("passport");
var facebook = require("passport-facebook");
var FacebookStrategy = facebook.Strategy;
function setup(User, config) {
    config = config.default;
    passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    }, function (accessToken, refreshToken, profile, done) {
        User.findOne({
            'facebook.id': profile.id
        }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    role: 'user',
                    username: profile.username,
                    provider: 'facebook',
                    facebook: profile._json
                });
                user.save(function (err) {
                    if (err)
                        return done(err);
                    done(err, user);
                });
            }
            else {
                return done(err, user);
            }
        });
    }));
}
exports.setup = setup;
;
