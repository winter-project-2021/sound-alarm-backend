var express = require('express');
var bodyParser = require('body-parser');
var fpcalc = require("fpcalc");  
var path = require('path')
var multer= require('multer');
const fs = require('fs');
var compare = require('./src/test.js');
const { json } = require('express');
const mongoose = require('mongoose');
const musicmodel= require('./model/music.js')
require('dotenv').config();


var app = express ();
var upload = multer();


app.listen(3000,function(){
    console.log("starting the server");
})

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false, limit: '1gb'}))


app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'./public/recorder.html'));
});

var time= new Date();



app.post('/ajax',upload.single('please'),function(req,res){

    
       var name='./public/wav/'+ time.getHours()+time.getMinutes()+time.getSeconds()+'.wav'// 저장 파일 이름
       fs.writeFileSync(name, Buffer.from(new Uint8Array(req.file.buffer))); // buffer의 blob을 wav로 내려받음
       console.log(req.file);
       compare.compare(name,'./public/wav/electronic3.wav');  // fingerprint 계산 및 비교 
       res.json({"result":"good"});
       

})
