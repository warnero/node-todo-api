var Routes = function(server) {

    var
        auth = require("../controllers/auth"),
        users = require("../controllers/users");

    var UserRoutes = function(){
        server.get("/user", auth.general, auth.refreshSessionData, users.current);
    }();

    return this;
};

module.exports = Routes;
