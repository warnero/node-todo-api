var Config = function(server) {

    var server_config = require("./server")(server);
    var routes = require("./routes")(server);
    
    return require("./settings");
};

module.exports = Config;
