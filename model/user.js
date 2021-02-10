const mongoose = require("mongoose"); // mongoose 모듈 불러오기
const Schema = mongoose.Schema;


const Audios = new Schema({
    data:Buffer,
    name:String,
    size:{type:Number,
        validate:[function(val){return (val<500000);}, "The size of the audio is too big"]
    },
    sensitivity:Number,
    fingerprint: Array
})


const userSchema = new Schema({
    username:{type:String,unique: true, required:true},
    stt: [{text:{type:String}}], 
    audio:[Audios],
    language: {type:String, default:'한국어'},
    alarmpush: {type:Boolean, default:true},
    alarmsound: {type:Number, default:1},
    alarm:{type:Boolean, default:true}
})

function arrayLimit (val){
    console.log("val_length",val);
    return val.length<5;
}

userSchema.path('audio').validate(arrayLimit,"arraylimit(max:5) has exceeded")







module.exports = new mongoose.model('User',userSchema);