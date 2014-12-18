var Redis = function(){
    var 
        Settings = require("./settings"),
        redis = require("redis"),
        rclient = redis.createClient(
            Settings.redis.options.port, 
            Settings.redis.options.host, 
            Settings.redis.options
        );

    redis.debug_mode = Settings.redis.debug;

    if(Settings.redis.options.pass) rclient.auth(Settings.redis.options.pass);

    return rclient;
}();

module.exports = Redis;