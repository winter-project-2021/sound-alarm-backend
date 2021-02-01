var fpcalc = require("fpcalc");
const WRONGDIGIT= 15 // 감지 기준.
const CRITERION= (32-WRONGDIGIT)/32*100
var number1=0
var number2=0
var test=["./test/electronic.mp3"]


compare= (number1,number2,name) => {
  console.log('========================================')
  console.log('filename: ', name)
  for(i=0;i<number1.length-number2.length;i++){
    var num=0;

    for(j=0;j<number2.length;j++){
     var bin=Math.abs((number1[i+j])^(number2[j])).toString(2)//xor 연산후 이진법 스트링으로 변경
     num+=(bin.split('1').length-1) // 1의 개수 세기
    }

      if(num<WRONGDIGIT*number2.length){
        console.log('')
        console.log('avgwrongdigit: ', num/number2.length)
        console.log('accuracy: ', (1- num/32/number2.length)*100)
        console.log('fingerprint:',number1[i])
        console.log('location: ',i)
        console.log('fpimage: ',bin)
      } 

    }
  console.log('========================================')
  }


  module.exports.compare= function(file1,file2){

  fpcalc(file1,{'raw':true},function(err, a) {
    if (err) throw err;
    console.log('CRITERION ',CRITERION);
    number1=a.fingerprint;
    console.log('sample fp:',number1);
  
  
    fpcalc(file2,{'raw':true},function(err, b) {
      if (err) throw err;
       number2=b.fingerprint;
       console.log('original fp:',number2);
       compare(number1,number2,file1);
  
    }) 
  })
  }

