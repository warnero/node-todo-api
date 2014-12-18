var AuthController = function(){

    var
        Settings = require("../config/settings"),
        User = require("../models/user"),
        AuthUtils = require("../utils/auth"),
        JSONUtils = require("../utils/json"),
        crypto = require("crypto"),
        restify = require("restify"),
        rclient = require("../config/redis");

    var _general = function(req, res, next){
        if ((!req.username && !req.user) || !req.authorization || req.authorization.scheme !== "Bearer") {
            return res.sendUnauthorized();
        } else {
            req.user = req.user || req.username;
            delete req.username;
            return next();
        }
    };

    var _refreshSessionData = function(req, res, next){
        return _refreshSessionForUser(req.user, function(err, user){
            req.user = user;
            return next();
        });
    };

    var _refreshSessionForUser = function(user, done) {
        User.Model
            .findOne({
                _id: user._id || user
            })
            .populate('services.clientService')
            .lean()
            .exec(function(err, user){
                if(err) return done(err);
                return done(err, user);
            });
    };

    var _generateToken = function(data){
        var random = Math.floor(Math.random() * 100001);
        var timestamp = (new Date()).getTime();
        var sha256 = crypto.createHmac("sha256", random + Settings.auth.token.salt + timestamp);
        return sha256.update(data).digest("base64");
    };

    var _saveToken = function(token, user, done) {
        var
            id = Settings.redis.prefix + token,
            maxAge = Settings.auth.token.maxAge;

        user = JSON.stringify(user);

        rclient.setex(id, maxAge, user, function(err){
            return done && done.apply(this, arguments);
        });
    };

    var _getTokenData = function(token, done) {
        var id = Settings.redis.prefix + token;

        rclient.get(id, function(err, data){
            if (err || !data) return done(err);
            return JSONUtils.safeParse(data, done);
        });
    };

    var _clearTokenData = function(token, done) {
        var id = Settings.redis.prefix + token;

        rclient.del(id, function(err, data){
            if (err || !data) return done(err);
            return done();
        });
    };

    var _validateClient = function(id, secret, done){
        console.log("validateClient %s %s", id, secret);
        return done(null,true);
    };

    var _grantUserToken = function(email, password, done){
        console.log("grantUserToken %s, %s", email, password);
        var hashedPassword = AuthUtils.hashPassword(password);
        User.Model
            .findOne({
                email: email.toLowerCase(),
                hashedPassword: hashedPassword
            })
            .exec(function(err, user){
                if(err || !user) return done(err, false);

                var token = _generateToken(email + ":" + password);

                _saveToken(token, user);

                return done(null, token);

            });

    };

    var _authenticateToken = function(token, done) {
        _getTokenData(token, function(err, data){
            return done(err, data);
        });
    };

    return {
        general: _general,
        refreshSessionData: _refreshSessionData,
        oauthHooks: {
            authenticateToken: _authenticateToken,
            validateClient: _validateClient,
            grantUserToken: _grantUserToken
        }
    };

}();

module.exports = AuthController;
