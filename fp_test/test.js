var fpcalc = require("fpcalc");
const WRONGDIGIT= 14
const CRITERION= (32-WRONGDIGIT)/32*100
var number1=0
var number2=0
var test=["./test/doorbell1.mp3"]

module.exports={
  compare();
}

 compare= (number1,number2,name) => {
  console.log('========================================')
  console.log('filename: ', name)
  for(i=0;i<number1.length-number2.length;i++){
    var num=0;

    for(j=0;j<number2.length;j++){
     var bin=Math.abs((number1[i+j])^(number2[j])).toString(2)
     num+=(bin.split('1').length-1)
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
  fpcalc("./test/doorbell_test3.mp3",{"raw":true},function(err, a) {
    if (err) throw err;
    console.log('CRITERION ',CRITERION)
    number1=a.fingerprint;
    console.log('sample fp:',number1);
  
  
    fpcalc(i,{"raw":true},function(err, b) {
      if (err) throw err;
       number2=b.fingerprint;
       console.log('original fp:',number2);
       compare1(number1,number2,i);
  
    }) 
  })
}

