const mongoose = require("mongoose"); // mongoose 모듈 불러오기
const Schema = mongoose.Schema;


const Audios = new Schema({
    buffer:{
        type:Buffer,
        required:[true,{ko:"음악 파일 인식이 제대로 되지 않았습니다.",en:"audio fild buffer is empty"}]
    },
    name:{
        type:String,
        required:[true,{ko:"음악 파일의 이름을 넣어주세요",en:"name value is empty"}]
    },
    size:{
        type:Number,
        validate:[function(val){return (val<1000000);},
            {ko:"파일 용량 문제, ",en:"Invalid size: recommend you to choose soundfile smaller than 300kb"}]
    },
    sensitivity: {
        type:Number, 
        default:60, 
        max:100, 
        min:0},
    fingerprint: {
        type:Array,
        validate:[function(val){return (val.length>1)},
            {ko:"음악 파일의 길이가 너무 짧습니다. 최소 3초 이상의 파일을 등록해주세요.",en:"The length of you file is too short, please register file longer than 3s"}]
    }
})


const userSchema = new Schema({
    username:{
        type:String,
        required:[true,{ko:"유저 이름이 없습니다. 인터넷 및 구글 로그인 과정 중의 문제일 수 있습니다.",en:"no user name, it may be a problem with your connection or the google login"}]
    },
    stt:{type:[{text:{
                        type:String,
                        required:[true,{ko:"텍스트가 비어 있습니다.",en:"text is empty"}]
                    }
                }],
        validate:[function(val){ return this.stt.length<11},{ko:"최대 10개까지 텍스트 등록이 가능합니다.",en:"you can save up to 10 text"}]
    }, 
    audio:{
        type:[Audios],
        validate:[function(val){return this.audio.length<6},
            {ko:"최대 5개까지 음악파일 등록이 가능합니다.",en:"you can save up to maximum 5 sounds "}]
        },
    language: {type:String, default:'ko'},
    alarmpush: {type:Boolean, default:false},
    alarmsound: {type:Number, default:1},
    alarm:{type:Boolean, default:true},
    alarmvolume:{type:Number, default:50}
})




module.exports = new mongoose.model('User',userSchema);