var express =require('express');
var router=express.Router();
var path =require('path');
var audio=require('./audio/audio');
var text=require('./text/text');
var setting=require('./setting/setting');
var multer= require('multer');
var upload = multer();
const user= require('../model/user.js');

router.get('/',function(req,res){
    console.log('main.js loaded')
    res.sendFile(path.join(__dirname , '../public/recorder.html'))
})

router.post('/login',upload.none(),function(req,res){// login 관련, req.body._id에 googleid 삽입.
    try{
        console.log("login",req.body);
        filter={username:req.body.username}
        user.findOne(filter,function(err,document){
            console.log(document)
            if(err) {
                console.log(err);
                res.send({result:'failure',msg:err});
            } 
            if(!document){
                user.create(filter,function(err,document){
                    if(err) res.send({result:'failure',msg:err});
                    else res.send(document)
                })
            }
            
            else res.send(document);
        });
    }catch(err){
        console.log(err);
        res.send({result:'failure',msg:err});
    }


})

router.use('/audio',audio);
router.use('/text',text);
router.use('/setting',setting);

module.exports=router;