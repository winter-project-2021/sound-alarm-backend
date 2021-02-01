var express = require('express');
var bodyParser = require('body-parser');
var fpcalc = require("fpcalc");  
var path = require('path')
var multer= require('multer');
const fs = require('fs');
//var upload = multer( { dest: './public/download/' });
var compare = require('./src/test.js');
const { json } = require('express');
const mongoose = require('mongoose');
const musicmodel= require('./model/music.js')
require('dotenv').config();


var app = express ();
var upload = multer();


// var storage = multer.diskStorage({
//     filename: function(req,file,cb){
//         cb(null,file.fieldname+)
//     }
// })
// const uri= process.env.ATLAS_URI;
// mongoose.connect(uri,{
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true
// })

// const connection= mongoose.connection;

// connection.once("open",()=>{
//     console.log("MongoDB database connection success");
// });

app.listen(3000,function(){
    console.log("starting the server");
})

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false, limit: '1gb'}))



// db.connect({
//     host: process.env.DB_HOST,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD
// });


app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'./public/recorder.html'));
});

var time= new Date();

// app.post('/',upload.single('music'),(req,res,next)=>{
//     var obj={
//         _id: 'hi',
//         name: 'req.body.name',
//         music:{
//             data: fs.readFileSync(req.file.buffer)
//         }
//     }
//     console.log(req.file)
// })

app.post('/ajax',upload.single('please'),function(req,res){

    
       var name='./public/wav/'+ time.getHours()+time.getMinutes()+time.getSeconds()+'.wav'// 저장 파일 이름
       fs.writeFileSync(name, Buffer.from(new Uint8Array(req.file.buffer))); // buffer의 blob을 wav로 내려받음
       console.log(req.file);
       compare.compare(name,'./public/wav/electronic3.wav');  // fingerprint 계산 및 비교 
       res.json({"result":"good"});
       

})

function makemp3(req){
    try{
        var process = new ffmpeg(req.file.path);
        var name = './public/mp3/'+ req.file.filename+'.mp3';
        //console.log(name,process);
        process.then(function(audio){
            audio.fnExtractSoundToMP3(name,function(error,file){
                if(!error)
                    console.log('Audio file: '+file);
                    return name;
            })
        },function(err){
            console.log("error: "+err);
        });
        console.log(process, 'later');
    } catch(e) {
        console.log(e);
    }   
}


function fpcheck(file){
    try{
    fpcalc(file,{'raw':true},function(err,result){
        console.log(result);
    })
    } catch(e){
        console.log(e);
    }
}

