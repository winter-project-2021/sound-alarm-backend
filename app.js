var express = require('express');
var bodyParser = require('body-parser');
const { json } = require('express');
const mongoose = require('mongoose');
var router=require('./router/index.js')
require('dotenv').config();

var app = express ();


mongoose.connect(process.env.ATLAS_URI, { 
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));


app.listen(3000,function(){
    console.log("starting the server");
})

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false, limit: '1gb'}))
app.use(router);


