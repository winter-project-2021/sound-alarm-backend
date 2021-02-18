var express =require('express');
var router=express.Router();
var multer= require('multer');
const user= require('../../model/user.js'); 
const controller= require('../../src/control.js')
const mongoose= require('mongoose');
var upload = multer();


router.post('/',upload.single('data'),async function(req,res){//나중에 front에서 req.body로 _id를 보냄.
    try{
        let filter={_id:req.body._id}  //현재 파일 용량 제한만 걸어둠.
        let fingerprint= await controller.getfingerprint(req.file.buffer)
        let update= {
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                buffer:req.file.buffer,
                size:req.file.size,
                fingerprint: fingerprint
        }   
        controller.getaudiofile(req.file.buffer);
        user.findOne(filter,{"audio":1},function(err,document){
             
             if(err) {res.send({result:"failure",msg:err.message});}
             else {  
                    for (var ele of document.audio){
                        if(ele.name===update.name){
                            res.send({result:"failure",msg: "That name has already registered"});
                            return;
                        }
                    }

                     document.audio.push(update);
                     document.save(function(err){
                        if(err){
                            let error = controller.handleErrors(err);
                            res.json(error);
                        }
                        else{
                            update.result="success"; 
                            res.send(update);
                        }
                    });
            }
        })}catch(err){
            console.log(err);
            res.send({result:"error",msg:err.message});
        }
  })

router.delete('/',function(req,res){//나중에 front 연결시 body로 userid,objectid를 보냄.
    try{
    let filter={_id:req.body._id}
    user.updateOne(filter,{'$pull':{'audio': {_id:req.body.audioid}}},async function(err,deleted){
    if(err) res.send({result:"failure",msg:err.message});
            
    else {
        if(deleted.nModified===0) res.send({result:"failure", msg:"not found"})
        else res.send({result:"success",audioid:req.body.audioid});
    }
})
}catch(err){
        res.send({result:"error",msg:err.message})
    }
})
    
router.put('/',function(req,res){//나중에 front에서 body로 _id,objectid와 name, sensitivity를 보냄.
    try{
    let filter={audio:{$elemMatch:{_id:req.body.audioid}}}

    user.updateOne(filter,
        {$set:{'audio.$.name':req.body.name,
        'audio.$.sensitivity':req.body.sensitivity}},{runValidators:true},
        async function(err,updated){//user의 id와 audio object의 id
            console.log(updated);
            if(err){
                let error = controller.handleErrors(err);
                res.json(error);
            }
            else {
                if(updated.nModified===0) res.send({result:"failure", msg:"not found"})
                else res.send({result:"success",audioid:req.body.audioid,name:req.body.name,sensitivity:req.body.sensitivity});
            }
        })}catch(err){
        res.send({"result":"error","msg":err.message})
}
})

router.post('/test',upload.single('data'),async function(req,res){// 마이크 sample의 fp 계산 후 업로드 된 파일들의 fp와 비교, 연결 작업 미완성.
    try{
    let result=false;
    let samplefp= await controller.getfingerprint(req.file.buffer);
    let originalfp= await controller.bringoriginalfp(req);
    console.log(originalfp);
    let accuracy =0;
    for(var ele of originalfp){ // 모든 저장된 소리지문과 비교
        accuracy= controller.compare(samplefp,ele.fp)
        console.log(accuracy)
        if(accuracy>ele.sensitivity) {// sensitivity보다 일치도가 높다면 success response
            res.send({"result":"success","name":ele.name,"sensitivity":ele.sensitivity,"accuracy":accuracy})
            result=true;
            break;
        }
    }
    if(!result)res.send({"result":"failure","name":originalfp[0].name,"sensitivity":originalfp[0].sensitivity,"accuracy":accuracy})
    }//sensitivity보다 일치도가 높은 것이 하나도 없다면 failure response
    catch(err){
         console.log(err);
         res.send({"result":"error","msg":err.message});
    }
})

module.exports=router