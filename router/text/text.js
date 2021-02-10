var express =require('express');
var router=express.Router();
var multer= require('multer');
var upload = multer();
const user= require('../../model/user.js');
const mongoose= require('mongoose');


router.post('/',upload.none(),async function(req,res){//나중에 front 연결시 body로 userid를 보냄.
    let filter={_id:req.body._id}  // 빈 query 왔을 때 막기,  개수제한 구현(?)
    let update={_id: mongoose.Types.ObjectId(),
                text:req.body.text}
        
    user.findOneAndUpdate(filter,{'$addToSet':{"stt":update}},{new:true,upsert:true},function(err,document){
        if(err) res.send(err);
        else {
            console.log(document);
            res.send(update);
        }
    });
})

router.delete('/',function(req,res){//나중에 front 연결시 body로 userid,objectid를 보냄.
    let filter={_id:req.body._id}
    user.updateOne(filter,{'$pull':{'stt': {_id:req.body.textid}}},function(err){
    if(err) res.send(err);
    else{
    res.send({textid:req.body.textid});
    }})
})

router.put('/',function(req,res){//나중에 front에서 body로 userid,objectid와 name, sensitivity를 보냄.
    let filter={_id:req.body._id, stt:{$elemMatch:{_id:req.body.textid}}}
    user.updateOne(filter,
        {$set:{'stt.$.text':req.body.text}},
        function(err,update){//user의 id와 audio object의 id
            if(err) res.send(err);
            console.log("update",update)
            res.send({text:req.body.text,textid:req.body.textid});
            })
})

module.exports=router;

