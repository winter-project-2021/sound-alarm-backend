var express =require('express');
var router=express.Router();
var multer= require('multer');
const fs = require('fs');
var fpcalc = require("fpcalc"); 
const user= require('../../model/user.js'); 
const audiofp= require('../../src/fingerprint.js')
const mongoose= require('mongoose');
var upload = multer();

let fingerprint=[]


router.post('/',upload.single('data'),async function(req,res){//나중에 front에서 req.body로 _id를 보냄.
    let filter={_id:req.body._id}  //현재 파일 용량 제한만 걸어둠.
    let fingerprint= await audiofp.getfingerprint(req.file.buffer)
    let update= {
            _id: mongoose.Types.ObjectId(),
            name: req.body.name,
            data:req.file.buffer,
            size:req.file.size,
            sensitivity:15,
            fingerprint: fingerprint
    }
    user.findOneAndUpdate(filter,{'$addToSet':{"audio":update}},{new:true,upsert:true,runValidators:true},function(err,document){
        if(err) res.send(err);
        else{
        fingerprint=[];
        for (var ele of document.audio){
                console.log(ele);
                fingerprint.push({"name":ele.name,"fp": ele.fingerprint})
        }
        console.log(fingerprint);
        res.send(update);
        }
    });
})


router.delete('/',function(req,res){//나중에 front 연결시 body로 userid,objectid를 보냄.
    let filter={_id:req.body._id}
    user.updateOne(filter,{'$pull':{'audio': {_id:req.body.audioid}}},async function(err,update){
    if(err) res.send(err);
    else {
        filter={_id:req.body._id};
        fingerprint=await collectfp(filter);
        console.log(fingerprint)
        res.send({audioid:req.body.audioid});
        };
    })
})
    
router.put('/',function(req,res){//나중에 front에서 body로 _id,objectid와 name, sensitivity를 보냄.
    let filter={_id:req.body._id, audio:{$elemMatch:{_id:req.body.audioid}}}
    user.updateOne(filter,
        {$set:{'audio.$.name':req.body.name,
        'audio.$.sensitivity':req.body.sensitivity}},
        async function(err,updates){//user의 id와 audio object의 id
            if(err) res.send(err);
            else {
                filter={_id:req.body._id}
                fingerprint= await collectfp(filter);
                console.log("here",fingerprint)
                res.send({name:req.body.name,sensitivity:req.body.sensitivity});
            }
})
})


router.post('/test',upload.single('data'),async function(req,res){// 마이크 sample의 fp 계산 후 업로드 된 파일들의 fp와 비교, 연결 작업 미완성.
    console.log(fingerprint);
    samplefp= await audiofp.getfingerprint(req.file.buffer);
    let accuracy =0;
    for(var ele of fingerprint){
        accuracy= audiofp.compare(samplefp,ele.fp)
        console.log(accuracy)
        if(accuracy>ele.sen) res.send({"result":true,"name":ele.name,"accuracy":accuracy})
    }
    res.send({"result":false,"name":"","accuracy":accuracy})
})


function collectfp(filter){// user db에 존재하는 모든 audio 파일들의 fp를 fingerprint array에 push
    let fingerprint=[];
    user.findOne(filter,{_id:0,audio:1},function(err,doc){
        console.log(doc);
        if(err) console.log(err);
        for (var ele of doc.audio){
            fingerprint.push({"name":ele.name,"fp": ele.fingerprint,"sen":ele.sensitivity})
        }
        return fingerprint;
    })
    
}

module.exports=router