var express =require('express');
var router=express.Router();
var multer= require('multer');
var upload = multer();
const user= require('../../model/user.js');
const controller=require('../../src/control.js')
const mongoose= require('mongoose');


router.post('/',upload.none(),async function(req,res){
    try{
        let filter={_id:req.body._id} 
        let update={
                    _id: mongoose.Types.ObjectId(),
                    text:req.body.text
                    }
        
        user.findOne(filter,{"stt":1},function(err,document){
            if(err) {console.log(err);res.send({result:"failure",ko:err.message.ko,en:err.message.en,err:err});}
            else {  
                for (var ele of document.stt){
                    if(ele.text===update.text){
                        res.send({result:"failure",ko:"이미 등록된 텍스트입니다.",en: "That text has already registered"});
                        return;
                    }
                }
                    document.stt.push(update);
                    document.save(function(err){
                        if(err){
                            console.log(err);
                            let error = controller.handleErrors(err);
                            res.json(error);
                        }
                        else{
                            update.result="success"; 
                            res.send(update);
                        }
                    });
            }
        })
    }catch(err){
        console.log(err);
        res.send({result:"error",ko:err,en:err});
    }
});

router.delete('/',function(req,res){
    try{
        let filter={_id:req.body._id}
        user.updateOne(filter,{'$pull':{'stt': {_id:req.body.textid}}},function(err,deleted){
            if(err){
                console.log(err);
                let error = controller.handleErrors(err);
                res.json(error);
            }
            else{
                if(deleted.n===0) res.send({result:"failure",ko:"찾는 결과가 없습니다.", en:"not found"})
                else res.send({result:"success",textid:req.body.textid});
            }
    })
    }catch(err){
        console.log(err);
        res.send({result:"error",ko:err,en:err});
    }
})

router.put('/',function(req,res){
    try{
        let filter={_id:req.body._id, stt:{$elemMatch:{_id:req.body.textid}}}
        user.updateOne(filter,
            {$set:{'stt.$.text':req.body.text}},
            {runValidators:true},
            function(err,updated){//user의 id와 audio object의 id
                if(err){
                    let error = controller.handleErrors(err);
                    res.json(error);
                }else{
                    if(updated.n===0) res.send({result:"failure",ko:"찾는 결과가 없습니다.", en:"not found"})
                    else res.send({result:"success",text:req.body.text,textid:req.body.textid});
            }})
    }catch(err){
        console.log(err);
        res.send({result:"error",ko:err,en:err});
    }
})

module.exports=router;

