var express = require('express');
const contact = require('../model/contact');
var router = express.Router();
var Contact = require('../model/contact');


//function get 
router.get('/', function(req, res){

    Contact.find(function(err, data){
        if(err) throw err;

        res.json(data);
    });   
});

//function add 
router.post('/add',function (req, res){
    var c = new contact({
        name : req.body.n,
        phone : req.body.phone,
        email : req.body.email
    });
    c.save();
});

//function delete 
router.get('/delete/:id',(req,res) =>{
    var ident = req.params.id;
    Contact.findOneAndRemove({_id:ident},function (err) {
        if(err)throw err 
    });
res.redirect('/contact/')
});

//function update 
router.post('/update/:id',(req,res)=>{
    var id =req.params.id;
    contact.findById({_id:id},(err,data)=>{
        data.name= req.body.name;
        data.phone=req.body.phone;
        data.email=req.body.email;
        data.save();
    });
    res.redirect('/contact/');
});

module.exports = router;