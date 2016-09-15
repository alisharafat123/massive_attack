// Load mongoose package
var mongoose = require('mongoose');
// Connect to MongoDB and create/use database called Users
mongoose.connect('mongodb://localhost:27017/massive_attack_db');
// Create a schema
var TodoSchema = new mongoose.Schema({
    name: String,
    completed: Boolean,
    note: String,
    updated_at: { type: Date, default: Date.now },
});
// Create a model based on the schema
var Users = mongoose.model('Users', TodoSchema);

// Create a todo in memory
var todo = new Users({name: 'Master NodeJS', completed: false, note: 'Getting there...'});
// Save it to database
todo.save(function(err){
    if(err)
        console.log(err);
    else
        console.log(todo);
});