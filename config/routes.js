var Routes = function(server) {

    var
        auth = require("../controllers/auth"),
        users = require("../controllers/users"),
        todos = require("../controllers/todos");

    var UserRoutes = function(){
        server.get("/user", auth.general, auth.refreshSessionData, users.current);
    }();

    var TodoRoutes = function(){
        server.post("/todos", auth.general, todos.add);
        server.get("/todos", auth.general, todos.list);
        server.get("/todos/:id", auth.general, todos.get);
        server.put("/todos/:id", auth.general, todos.update);
    }();

    return this;
};

module.exports = Routes;
