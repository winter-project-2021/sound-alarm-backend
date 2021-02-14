var express =require('express');
var router=express.Router();
var multer= require('multer');
var upload = multer();
const user= require('../../model/user.js');
const mongoose= require('mongoose');


router.put('/',function(req,res){//나중에 front에서 body로 _id를 보냄.
    try{
        console.log(req.body);
        let filter={_id:req.body._id}
        let update= {language:req.body.language,
            alarmpush:req.body.alarmpush,
            alarmsound:req.body.alarmsound,
            alarm:req.body.alarm,
            alarmvolume: req.body.alarmvolume
            }
        user.updateOne(filter,update,
            function(err,updates){//user의 id와 audio object의 id
                console.log(updates);
                if(err) res.send({result:"failure",msg:err});
                else {
                    update.result="success";
                    res.send(update);
                }
                })
        }catch(err){
            console.log(err);
            res.send({result:"error",msg:err});            
        }
})

module.exports=router;