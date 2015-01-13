var TestData = function(){

    var
        mongoose = require("mongoose"),
        async = require("async"),
        conf = require("../../config/settings"),
        User = require("../../models/user").Model,
        Todo = require("../../models/todo").Model,
        AuthUtils = require("../../utils/auth");

    var _clearDatabase = function(done){
        async.parallel([
            function(cb) { User.remove({}, cb); },
            function(cb) { Todo.remove({}, cb);}
        ], function(err, res){
            if(err) throw err;
            return done(err, res);
        });
    };

    var _createTestData = function(done){
         var
            users = require("../data/users.data").map(function(usr){
                usr.hashedPassword = AuthUtils.hashPassword("password");
                usr._id = new mongoose.Types.ObjectId;
                return usr;
            }),
            todos = require("../data/todos.data").map(function(todo){
                todo.user = users[0]._id;
                return todo;
            });


        async.parallel([
            function(cb) {
                User.create(users, cb);
            },
            function(cb) {
                Todo.create(todos, cb);
            }
        ], function(err, res){
            if(err) { console.log(err); return done(err); }

            return done(err, res);
        });

    };

    return {
        clearDatabase: _clearDatabase,
        createTestData: _createTestData
    };

}();

module.exports = TestData;