const mongoose = require("mongoose"); // mongoose 모듈 불러오기
const Schema = mongoose.Schema;


const Audios = new Schema({
    buffer:{
        type:Buffer,
        required:[true,"file"]
    },
    name:{
        type:String,
        required:[true,"name value is empty"]
    },
    size:{
        type:Number,
        validate:[function(val){return (val<300000);},
            "Invalid size: recommend you to choose soundfile smaller than 300kb"]
    },
    sensitivity: {
        type:Number, 
        default:60, 
        max:100, 
        min:0},
    fingerprint: {
        type:Array,
        validate:[function(val){return (val.length>1)},
            "fingerprint"]
    }
})


const userSchema = new Schema({
    username:{
        type:String,
        required:[true,"no username?"]
    },
    stt:{type:[{text:{
                        type:String,
                        required:[true,"text"]
                    }
                }],
        validate:[function(val){ return this.stt.length<11},"you can save up to maximum 10 texts."]
    }, 
    audio:{
        type:[Audios],
        validate:[function(val){return this.audio.length<6},
            "you can save up to maximum 5 sounds "]
        },
    language: {type:String, default:'ko'},
    alarmpush: {type:Boolean, default:false},
    alarmsound: {type:Number, default:1},
    alarm:{type:Boolean, default:true},
    alarmvolume:{type:Number, default:50}
})




module.exports = new mongoose.model('User',userSchema);