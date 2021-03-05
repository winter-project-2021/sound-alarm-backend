var fpcalc = require("fpcalc");
const fs = require('fs');
const user= require('../model/user.js');


const removeAudioFile=(name)=>{return new Promise((resolve,reject) =>{
    try{
        fs.access(name,fs.constants.F_OK,(err)=>{
            if(err) reject (err);
            fs.unlink(name,(err)=>{
                if(err) reject (err);
                else resolve(console.log("removed"));
            })
        })
    }catch(err){
        console.log(err);
        reject(err);
    }
})

}


const getAudioFile = (buffer) =>  {return new Promise((resolve,reject) => { //buffer를 file로 내려받음
    try{
        const time= new Date();
        const name='./public/wav/'+ time.getHours()+time.getMinutes()+time.getSeconds()+'.wav'
        fs.writeFileSync(name,buffer);
        resolve(name);
    }catch(err){
        console.log(err);
        reject(err);
    }
})
}

const fpAlgo = (name)=>{return new Promise((resolve,reject) => {//내려받은 파일에 fpcalc 적용
        fpcalc(name,{'raw':true},(err,res) => {
            if(err) reject(err);
            try{
                let fingerprint = res.fingerprint
                resolve(fingerprint)
            } catch(err){
                reject(err);
            }
        })
    }
)}

const bringOriginalFp= (req)=>{ return new Promise((resolve,reject)=>{
    try{
        let mode= req.body.mode;
        let filter={_id:req.body._id}
        let option={audio:1};
        let sensitivity;
        if(mode==='test'){ // sensitivity 조정 모드: audioid로 현재 테스트하는 소리파일의 fp만 가져옴. 
            option={audio:{$elemMatch:{_id:req.body.audioid}}};
        }
        user.findOne(filter,option,function(err,doc){
            if(err) {
                console.log(err);
                reject(err)
            }else{
                let fingerprint=[];
                for (var ele of doc.audio){
                    sensitivity=ele.sensitivity;
                    fingerprint.push({"name":ele.name,"fp": ele.fingerprint,"sensitivity":sensitivity})
            }
            resolve(fingerprint);
        }
        })
    }catch(err){
        reject(err);
    }
})
}

const getFingerPrint = async (buffer)=> {// 파일의 fp 계산
    try{
        let name = await getAudioFile(buffer);
        let fp = await fpAlgo(name);
        removeAudioFile(name);
        return fp;
    }catch(error){
        return(error);// error에서 잡히는 문제 해결할 것.
    }
}


const compare= (fp1,fp2) => {// fp 비교 모듈
    try{
    console.log('========================================')
    console.log('test start')
    console.log('')
    var largest=0;
    if(fp1.length>fp2.length){
        var long=fp1;
        var short=fp2;
    }else{
        var long=fp2;
        var short=fp1;
    }
    for(i=0;i<long.length-short.length;i++){
        var num=0;
        var accuracy=0;

        for(j=0;j<short.length;j++){
            var bin=Math.abs((long[i+j])^(short[j])).toString(2)//xor 연산후 이진법 스트링으로 변경
            num+=(bin.split('1').length-1) // 1의 개수 세기
        }
        accuracy=(1-num/32/short.length)*100
        if(largest<accuracy) largest=accuracy;
    } 
    return largest;
    }catch(err){
        console.log(err);
    }
}
    
    const handleErrors = (err)=>{
        try{
            console.log(err.errors);
            let errors={result:"failure", ko:"",en:""};
            if(err.code===11000){
                errors.msg='That sound or text is already registered!'
            }

            if(err.message.includes('validation failed')|err.message.includes('Validation failed')){
                console.log(err.errors);
                ele=Object.values(err.errors)[0];
                    errors.ko=ele.properties.message.ko;
                    errors.en=ele.properties.message.en;
            }
        
            return errors
        }catch(err){
            console.log(err);
        }
    }


  module.exports={compare,getFingerPrint,bringOriginalFp,handleErrors,getAudioFile}

