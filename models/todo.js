var TodoModel = function(){

    var 
        mongoose = require("mongoose"),
        Schema = mongoose.Schema;

    var _jsonSchema = {
        _id: {type:Schema.Types.ObjectId, "default":mongoose.Types.ObjectId},
        text: String,
        created: {type: Date, "default": Date.now},
        completed: {type:Boolean, "default": false},
        completedOn: Date,
        position: {type:Number, "default":0}
    };

    var _schema = mongoose.Schema(_jsonSchema);

    var _model = mongoose.model("Todo", _schema);

    return {
        Schema: _schema,
        Model: _model,
        jsonSchema: _jsonSchema
    };

}();

module.exports = TodoModel;