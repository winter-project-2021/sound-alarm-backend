var express = require('express');
var bodyParser = require('body-parser');
const { json } = require('express');
const mongoose = require('mongoose');
var router=require('./router/index.js')
var cors= require('cors');
require('dotenv').config();

var app = express ();
const options = {
  origin: '*', 
  credentials: true, 
  optionsSuccessStatus: 200  
};

mongoose.connect(process.env.ATLAS_URI, { 
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true })
      .then(() => console.log('Successfully connected to mongodb'))
      .catch(e => console.error(e));
 
   
app.listen(4000,function(){
    console.log("starting the server");
})

app.use(cors(options));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false, limit: '1gb'}))
app.use(router);


