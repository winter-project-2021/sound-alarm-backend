var express = require('express');
var app= express ();
var bodyParser = require('body-parser');
var fpcalc = require("fpcalc");  
var path = require('path')
var multer= require('multer');
const fs = require('fs');
var upload = multer({ dest: './public/download/' });
var ffmpeg = require('ffmpeg');

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

app.post('/ajax',upload.single('please'),function(req,res){  
       //fs.writeFileSync('./public/mp3/'+ req.file.originalname+'.mp3', Buffer.from(new Uint8Array(req.file.buffer)));      
       //makemp3(req);
       fpcheck(req.file.filename);
       console.log(req.file);

})

function makemp3(req){
    try{
        var process = new ffmpeg(req.file.path);
        var name = './public/mp3/'+ req.file.filename+'.mp3w';
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
    fpcalc('public/mp3/blob.mp3',{'raw':true},function(err,result){
        console.log(result);
    })
    } catch(e){
        console.log(e);
    }
}

