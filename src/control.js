var fpcalc = require("fpcalc");
const fs = require('fs');
const user= require('../model/user.js');


const getaudiofile = (buffer) =>  {return new Promise((resolve,reject) => { //buffer를 file로 내려받음
    const time= new Date();
    const name='./public/wav/'+ time.getHours()+time.getMinutes()+time.getSeconds()+'.wav'
    fs.writeFileSync(name,buffer);
    resolve(name);
    })
}

const fpalgo = (name)=>{return new Promise((resolve,reject) => //내려받은 파일에 fpcalc 적용
    fpcalc(name,{'raw':true},(err,res) => {
    if(err) reject(new Error("failure"));
    let fingerprint = res.fingerprint
    resolve(fingerprint)}
    )
)}

const bringoriginalfp= (req)=>{ return new Promise((resolve,reject)=>{
    let mode= req.body.mode;
    let filter={_id:req.body._id}
    let option={audio:1};
    let sensitivity;
    if(mode==='test'){ // sensitivity 조정 모드 일때
        option={audio:{$elemMatch:{_id:req.body.audioid}}};
        sensitivity=req.body.sensitivity;
    }
    user.findOne(filter,option,function(err,doc){
        if(err) {console.log(err);
            reject(("search failure"))}
        else{
        let fingerprint=[];
        for (var ele of doc.audio){
            if(mode==='compare') sensitivity=ele.sensitivity;//일반 비교 모드일 때 난이도.
            fingerprint.push({"name":ele.name,"fp": ele.fingerprint,"sensitivity":sensitivity})
        }
        console.log(fingerprint);
        resolve(fingerprint);
    }
    })
})
}





async function getfingerprint(buffer){// 파일의 fp 계산
    try{
    let name = await getaudiofile(buffer);
    let fp = await fpalgo(name);
    return fp;
    }catch(error){return(error)}// error에서 잡히는 문제 해결할 것.
}


const compare= (fp1,fp2) => {// fp 비교 모듈
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
     if(largest<accuracy){
         largest=accuracy;
     }
    } 
    //   if(num<WRONGDIGIT*short.length){
    //     console.log('')
    //     console.log('avgwrongdigit: ', num/short.length)
    //     console.log('accuracy: ', (1- num/32/short.length)*100)
    //     console.log('fingerprint:',long[i])
    //     console.log('location: ',i)
    //     console.log('fpimage: ',bin)
    //   } 
    return largest;
    }
    
    const handleErrors = (err)=>{
        console.log(err.message);
        let errors={result:"failure", type:[]};
        if(err.message.includes('validation failed')|err.message.includes('Validation failed')){
            console.log(err.errors);
            Object.values(err.errors).forEach((ele)=>{
                errors.type.push(ele.properties.message);
            })
        }
        return errors
    }


  module.exports={compare,getfingerprint,bringoriginalfp,handleErrors}

