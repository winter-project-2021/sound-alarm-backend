var fpcalc = require("fpcalc");
const WRONGDIGIT= 14 // 비교할 두 소리지문 element들의 다른 digit 개수 평균 기준값
const CRITERION= (32-WRONGDIGIT)/32*100
var number1=0
var number2=0
var test=["./test/doorbell1.mp3"]// sample들과 비교할 짧은 소리 파일의 경로를 test array에 삽입

 compare= (number1,number2,name) => {
  console.log('========================================')
  console.log('filename: ', name)
  for(i=0;i<number1.length-number2.length;i++){
    var num=0;

    for(j=0;j<number2.length;j++){// 2번째 소리파일 지문의 element 개수를 기준으로 한 칸씩 밀면서 비교
     var bin=Math.abs((number1[i+j])^(number2[j])).toString(2)// xor 후 이진수로 환산, abs는 부호를 고려한 것. 
     num+=(bin.split('1').length-1)//1의 개수 세기.
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



for (let i of test){
  fpcalc("./test/doorbell_test3.mp3",{"raw":true},function(err, a) {//test의 소리파일과 비교할 sample 긴 소리파일 경로
    if (err) throw err;
    console.log('CRITERION ',CRITERION)
    number1=a.fingerprint;
    console.log('sample fp:',number1);
  
  
    fpcalc(i,{"raw":true},function(err, b) {
      if (err) throw err;
       number2=b.fingerprint;
       console.log('original fp:',number2);
       compare(number1,number2,i);
  
    }) 
  })
}

