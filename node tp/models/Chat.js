var mongoose = require("mongoose")
var Schema = mongoose.Schema

var Chat = new Schema({
    message: String,
    date: Date
})

module.exports = mongoose.model("Chat", Chat)