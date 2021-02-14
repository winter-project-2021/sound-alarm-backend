const mongoose = require("mongoose"); // mongoose 모듈 불러오기
const Schema = mongoose.Schema;


const Audios = new Schema({
    data:{type:Buffer,required:[true,"file"]},
    name:{type:String,required:[true,"name"]},
    size:{type:Number,
        validate:[function(val){return (val<500000);},"size"]
    },
    sensitivity: Number,
    fingerprint: {type:Array,
        validate:[function(val){return (val.length>1)},"fingerprint"]
    }
})


const userSchema = new Schema({
    username:{type:String,unique: true, required:[true,"no username?"]},
    stt:{type:[{text:{type:String,
                required:[true,"text"]
            }}],
        validate:[function(val){ return this.stt.length<11},"arraylimit"]}, 
    audio:{type:[Audios],
        validate:[function(val){return this.audio.length<6},"arraylimit"]},
    language: {type:String, default:'한국어'},
    alarmpush: {type:Boolean, default:true},
    alarmsound: {type:Number, default:1},
    alarm:{type:Boolean, default:true},
    alarmvolume:{type:Number, default:5}
})

// userSchema.pre('save',function(next){
//     if(this.audio.length>5|this.stt.length>10) throw({message:'validation failed',errors:[{path:'arraylimit'}]})
//     next();
// })









module.exports = new mongoose.model('User',userSchema);