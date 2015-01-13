var UsersController = function(){

    var
        settings = require("../config/settings"),
        mongoose = require("mongoose"),
        async = require('async'),
        restify = require("restify"),
        restifyErrors = require("../config/errors")(restify),
        _ = require("lodash"),
        Todo = require("../models/todo");

    var _add = function(req, res, next) {
        var
            _user = req.user;

        var todo = new Todo.Model(req.params);
        todo.user = _user._id
        todo.save(function(err, saved){
            if(err && err.errors) {
                return next(new restifyErrors.InvalidInputError(err.errors));
            }
            else if(err) return next(err);
            return res.send(saved);
        });

    };

    var _list = function(req, res, next) {
        var
            _user = req.user;
        Todo.Model
            .find({
                user: _user._id,
                completed:false
            })
            .lean()
            .exec(function(err, todos){
                if(err) return next(err);
                res.send(todos);
            });
    };

    var _get = function(req, res, next) {
        var
            _user = req.user,
            id = req.params.id;

        Todo.Model
            .findOne({
                _id:id,
                user:_user._id
            })
            .lean()
            .exec(function(err, todo){
                if(err) return next(err);
                if(!todo) {
                    return next(new restify.ResourceNotFoundError("Todo not found"));
                }
                res.send(todo);
            });
    };

    var _update = function(req, res, next) {
        var
            _user = req.user,
            id = req.params.id;

        Todo.Model
            .findOne({
                _id:id,
                user:_user._id
            })
            .exec(function(err, todo){
                if(err) return next(err);
                if(!todo) {
                    return next(new restify.ResourceNotFoundError("Todo not found"));
                }
                console.log("params %j", req.params);
                todo = _.assign(todo, req.params);
                console.log("modified todo %j", todo);
                todo.save(function(err, saved){
                    if(err) next(err);
                    return res.send(saved);
                });
            });
    };

    return {
        add: _add,
        list: _list,
        get: _get,
        update:_update
    };
}();

module.exports = UsersController;
