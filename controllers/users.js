var UsersController = function(){

    var
        settings = require("../config/settings"),
        mongoose = require("mongoose"),
        async = require('async'),
        restify = require("restify"),
        restifyErrors = require("../config/errors")(restify),
        _ = require("lodash");

    var _current = function(req, res, next) {
        var
            user = req.user;
        console.log("user %j", user);
        return res.send(user);

    };

    var _list = function(req, res, next) {

    };

    return {
        current: _current,
        list: _list
    };
}();

module.exports = UsersController;
