var fpcalc = require("fpcalc");
const fs = require('fs');

const getaudiofile = (buffer) =>  {return new Promise((resolve) => { //buffer를 file로 내려받음
    const time= new Date();
    const name='./public/wav/'+ time.getHours()+time.getMinutes()+time.getSeconds()+'.wav'
    fs.writeFileSync(name,buffer);
    resolve(name);
    })
}

const fpalgo = (name)=>{return new Promise((reject,resolve) => //내려받은 파일에 fpcalc 적용
    fpcalc(name,{'raw':true},(err,res) => {
    if(err) reject(new Error("failure"));
    let fingerprint = res.fingerprint
    resolve(fingerprint)}
    )
)}

module.exports.getfingerprint= async function getfingerprint(buffer){// 파일의 fp 계산
    try{
    let name = await getaudiofile(buffer);
    let fp = await fpalgo(name);
    return fp;
    }catch(error){return(error)}// error에서 잡히는 문제 해결할 것.
}


module.exports.compare= (number1,number2,name) => {// fp 비교 모듈
  console.log('========================================')
  console.log('filename: ', name)
  var largest=0;
  for(i=0;i<number1.length-number2.length;i++){
    var num=0;
    var accuracy=0;

    for(j=0;j<number2.length;j++){
     var bin=Math.abs((number1[i+j])^(number2[j])).toString(2)//xor 연산후 이진법 스트링으로 변경
     num+=(bin.split('1').length-1) // 1의 개수 세기
     accuracy=(1-num/32/number2.length)*100
     if(largest>accuracy){
         largest=accuracy;
     }
    } 
    //   if(num<WRONGDIGIT*number2.length){
    //     console.log('')
    //     console.log('avgwrongdigit: ', num/number2.length)
    //     console.log('accuracy: ', (1- num/32/number2.length)*100)
    //     console.log('fingerprint:',number1[i])
    //     console.log('location: ',i)
    //     console.log('fpimage: ',bin)
    //   } 

    }
    return largest;

//   console.log('========================================')
  }

