var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var users = new Schema({
    username : String,
    passworrd : Number  
});

module.exports = mongoose.model('users', users);