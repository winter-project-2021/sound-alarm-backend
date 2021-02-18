var express =require('express');
var router=express.Router();
var multer= require('multer');
var upload = multer();
const user= require('../../model/user.js');
const controller=require('../../src/control.js')
const mongoose= require('mongoose');


router.post('/',upload.none(),async function(req,res){//나중에 front 연결시 body로 userid를 보냄.
        try{
        let filter={_id:req.body._id}  // 빈 query 왔을 때 막기,  개수제한 구현(?)
        let update={
                    _id: mongoose.Types.ObjectId(),
                    text:req.body.text
                    }
        
                user.findOne(filter,{"stt":1},function(err,document){
                    if(err) {console.log(err);res.send({result:"failure",msg:err.message});}
                    else {  
                        for (var ele of document.stt){
                            if(ele.text===update.text){
                                res.send({result:"failure",msg: "That text has already registered"});
                                return;
                            }
                        }
                            document.stt.push(update);
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
               })
        }catch(err){
            console.log(err);
            res.send({result:"error",msg:err});
        }
});

router.delete('/',function(req,res){//나중에 front 연결시 body로 userid,objectid를 보냄.
    try{
        let filter={_id:req.body._id}
        user.updateOne(filter,{'$pull':{'stt': {_id:req.body.textid}}},function(err,deleted){
            if(err){
                let error = controller.handleErrors(err);
                res.json(error);
            }
            else{
                if(deleted.nModified===0) res.send({result:"failure", msg:"not found"})
                else res.send({result:"success",textid:req.body.textid});
            }
    })
    }catch(err){
        console.log(err);
        res.send({result:"error",msg:err});
    }
})

router.put('/',function(req,res){//나중에 front에서 body로 userid,objectid와 name, sensitivity를 보냄.
    try{
        let filter={_id:req.body._id, stt:{$elemMatch:{_id:req.body.textid}}}
        user.updateOne(filter,
            {$set:{'stt.$.text':req.body.text}},
            {runValidators:true},
            function(err,update){//user의 id와 audio object의 id
                if(err){
                    let error = controller.handleErrors(err);
                    res.json(error);
                }else{
                    console.log("update",update)
                    res.send({result:"success",text:req.body.text,textid:req.body.textid});
            }})
    }catch(err){
        console.log(err);
        res.send({result:"error",msg:err});
    }
})

module.exports=router;

