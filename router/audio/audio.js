var express =require('express');
var router=express.Router();
var multer= require('multer');
const user= require('../../model/user.js'); 
const controller= require('../../src/control.js')
const mongoose= require('mongoose');
var upload = multer();


router.post('/',upload.single('data'),async function(req,res){
    try{
        let filter={_id:req.body._id}  
        let fingerprint= await controller.getFingerPrint(req.file.buffer)
        let update= {
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                buffer:req.file.buffer,
                size:req.file.size,
                fingerprint: fingerprint
        }   
        controller.getAudioFile(req.file.buffer);
        user.findOne(filter,{"audio":1},function(err,document){//using update as filter to search and project only audio
             
             if(err) {res.send({result:"failure",msg:err.message});}
             else {  
                for (var ele of document.audio){
                    if(ele.name===update.name){
                        res.send({result:"failure",ko:"이미 등록된 이름입니다.",en: "That name has already registered"});
                        return;
                    }
                }

                document.audio.push(update);
                document.save(function(err){
                    if(err){// search error handling
                        let error = controller.handleErrors(err);
                        res.json(error);
                    }
                    else{
                        update.result="success"; 
                        res.send(update);
                    }
                });
            }
        })}catch(err){ //server error handling
            console.log(err);
            res.send({result:"error",ko:err.message,en:err.message});
            }
  })

router.delete('/',function(req,res){
    try{
        console.log(req.body);
        let filter={_id:req.body._id}
        user.updateOne(filter,{'$pull':{'audio': {_id:req.body.audioid}}},async function(err,deleted){
        if(err) res.send({result:"failure",msg:err.message});
        else {
            if(deleted.n===0) res.send({result:"failure",ko:"찾는 결과가 없습니다." ,en:"not found"}) // if nothing has returned from the search
            else res.send({result:"success",audioid:req.body.audioid});
        }
        })
    }catch(err){
        res.send({result:"error",ko:err.message,en:err.message})
    }
})
    
router.put('/',function(req,res){
    try{
        let filter={audio:{$elemMatch:{_id:req.body.audioid}}}

        user.updateOne(filter,
            {$set:{'audio.$.name':req.body.name,'audio.$.sensitivity':req.body.sensitivity}},
            {runValidators:true},
            async function(err,updated){
                console.log(updated);
                if(err){
                    let error = controller.handleErrors(err);
                    res.json(error);
                }
                else {
                    if(updated.n===0) res.send({result:"failure", ko:"찾는 결과가 없습니다.",en:"not found"})// if nothing has returned from the search
                    else res.send({
                        result:"success",
                        audioid:req.body.audioid,
                        name:req.body.name,
                        sensitivity:req.body.sensitivity
                    });
                }
    })}catch(err){
        res.send({"result":"error","ko":err.message,"en":err.message})
    }
})

router.post('/test',upload.single('data'),async function(req,res){// calculate the sample fingerprint then compare with the orginal's
    try{
        let result=false;
        let samplefp= await controller.getFingerPrint(req.file.buffer);
        let originalfp= await controller.bringOriginalFp(req);
        console.log(samplefp);
        let accuracy =0;
        for(var ele of originalfp){ // compare with the original fingerprint
            accuracy= controller.compare(samplefp,ele.fp)
            console.log(accuracy)
            if(accuracy>ele.sensitivity) {// if the sample's accuracy is higher than the sensitivity, send match :true
                res.send({
                "result":"success",
                match:true, 
                "name":ele.name,
                "sensitivity":ele.sensitivity,
                "accuracy":accuracy
                 })
                result=true;
                break;
            }
        }
        if(!result)res.send({
            "result":"success",
            match:false,
            "accuracy":accuracy
        })
    }
    catch(err){
         console.log(err);
         res.send({"result":"error","ko":err.message,"en":err.message});
    }
})

module.exports=router