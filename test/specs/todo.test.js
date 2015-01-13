var
    request = require("supertest"),
    should = require("should"),
    mongoose = require("mongoose"),
    conf = require("../../config/settings"),
    User = require("../../models/user").Model,
    Todo = require("../../models/todo").Model;

function logUserIn(email, done) {
     User
        .findOne({
            email: email
        })
        .exec(function(err, usr){
            if(err) throw err;

            var data = {
                username: usr.email,
                password: "password",
                grant_type: "password"
            };

            request(server)
                .post("/token")
                .send(data)
                .auth("foo","bar")
                .end(function(err, res){
                    if(err) throw err;
                    return done(err,{
                        user: usr,
                        token: res.body
                    });
                });
        });
}

describe("Todos", function(){
    var todo_to_change;

    describe("POST /todos", function(){
        var
            user,
            user_token;

        before(function(done){
            this.timeout(10000);
            var emit = function(){
                if (
                    !user ||
                    !user_token  
                ) return;
                return done();
            };


            logUserIn("warner2@test.com", function(err, data){
                if(err) throw err;
                user = data.user;
                user_token = data.token;
                return emit();
            });
        });
        it("should add a new todo for the currently logged in user", function(done) {
            var data = {
                text: "This is a todo",
                notes: "Nothing to speak of"
            };
            request(server)
                .post("/todos")
                .set("Authorization", user_token.token_type + " " + user_token.access_token)
                .send(data)
                .end(function(err, res){
                    should.not.exist(err);
                    should.exist(res.body);

                    console.log(res.body);

                    res.statusCode.should.equal(200);
                    should.exist(res.body._id);
                    res.body.text.should.equal(data.text);
                    res.body.notes.should.equal(data.notes);
                    res.body.completed.should.equal(false);

                    return done();
                });
        });
    });
    describe("GET /todos", function(){
        var
            user,
            user_token,
            todo_id;

        before(function(done){
            this.timeout(10000);
            var emit = function(){
                if (
                    !user ||
                    !user_token  
                ) return;
                return done();
            };


            logUserIn("warner@test.com", function(err, data){
                if(err) throw err;
                user = data.user;
                user_token = data.token;
                return emit();
            });
        });
        it("should retrieve all todos for currently logged in user", function(done) {
            request(server)
                .get("/todos")
                .set("Authorization", user_token.token_type + " " + user_token.access_token)
                .end(function(err, res){
                    should.not.exist(err);
                    should.exist(res.body);

                    console.log(res.body);

                    res.statusCode.should.equal(200);
                    res.body.length.should.equal(2);
                    todo_id = res.body[0]._id;
                    todo_to_change = res.body[1]._id;
                    return done();
                });
        });
        it("should retrieve a specific todo", function(done) {
            request(server)
                .get("/todos/" + todo_id)
                .set("Authorization", user_token.token_type + " " + user_token.access_token)
                .end(function(err, res){
                    should.not.exist(err);
                    should.exist(res.body);

                    console.log(res.body);

                    res.statusCode.should.equal(200);
                    should.exist(res.body.text);
                    return done();
                });
        });
    });

    describe("PUT /todos/:id", function(){
        var
            user,
            user_token,
            todo_id;

        before(function(done){
            this.timeout(10000);
            var emit = function(){
                if (
                    !user ||
                    !user_token  
                ) return;
                return done();
            };


            logUserIn("warner@test.com", function(err, data){
                if(err) throw err;
                user = data.user;
                user_token = data.token;
                return emit();
            });
        });
        it("should update a specific todo", function(done) {
            var data = {
                text: "Updated Text",
                notes: "New notes."
            };
            request(server)
                .put("/todos/" + todo_to_change)
                .set("Authorization", user_token.token_type + " " + user_token.access_token)
                .send(data)
                .end(function(err, res){
                    should.not.exist(err);
                    should.exist(res.body);

                    console.log(res.body);

                    res.statusCode.should.equal(200);
                    should.exist(res.body.text);
                    res.body.text.should.equal(data.text);
                    res.body.notes.should.equal(data.notes);
                    return done();
                });
        });
    });

});