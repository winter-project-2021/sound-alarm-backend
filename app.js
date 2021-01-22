var express = require('express');
var app= express ();
var bodyParser = require('body-parser');
var fpcalc = require("fpcalc");  
var path = require('path')
var multer= require('multer');
const fs = require('fs');
var upload = multer();
var recorder= require('recorder-js');
var ffmpeg = require('ffmpeg');
//var upload = multer( { dest: './public/download/' });
var upload = multer();
var compare = require('./test.js');
const { json } = require('express');

// var storage = multer.diskStorage({
//     filename: function(req,file,cb){
//         cb(null,file.fieldname+)
//     }
// })


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
       
       var name='./public/mp3/'+ time.getHours()+time.getMinutes()+time.getSeconds()+'.wav'
       fs.writeFileSync(name, Buffer.from(new Uint8Array(req.file.buffer)));      
       //makemp3(req);
       console.log(req.file);
       compare.compare(name,'./public/mp3/doorbell.wav');
       //num2= fpcheck('./public/mp3/doorbell.mp3').fingerprint;
       //compare.compare(num1,num2,'result');
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

