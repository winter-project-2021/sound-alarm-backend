# sound-alarm-backend

1. fp_test 결과 확인
  1) npm install 후 node_modules의 fpcalc의 index.js의 46번째 줄을 results.fingerprint=fingerprint; 로 수정, 47~50번째 줄 주석처리
  2) node test.js로 코드 실행
     - 2번째 줄 WRONGDIGIT은 비교할 두 소리지문 element들의 다른 digit 개수 평균 기준값이다. 만약 비교결과 소리지문 비교 결과 나온 값이 이보다 작으면 콘솔에 표시된다.   
     - 5번째 줄 test 변수에는 sample들과 비교할 짧은 소리 파일의 경로를 array에 넣는다.
     - 35번째 줄에는 test의 소리파일과 비교할 sample 긴 소리파일 경로를 넣는다.
     
      
     => test의 소리들중 doorbell_test와 doorbell 파일들로만 실험해보면 될 것 같음. doorbell_test는 noise + doorbell_answer을 섞은 소리로 1~4순으로 noise가 약해짐
        doorbell은 소리 원본. test 할 때는 doorbell1으로 해야 오류가 안 생김 ( 원본 파일 길이가 너무 짧아서 발생하는 문제)
        
  3) 해석 
      코드를 돌리면 original이 짧은 소리파일. sample이 긴 소리파일의 소리지문이고 WRONGDIGIT 값보다 차이가 적으면 콘솔창에 해당 위치 및 관련 정보가 표시된다.
      
  4) 결과
     - wav, mp3, m4a 모두 다 소리지문으로 변환 가능. 그러나 형식 차이로 인해 소리지문이 조금씩 변형될 수 있다. 따라서 비교할 두 지문의 형식은 같게 두어야 오차를 최소화할 수 있다.
     - 최소 3초 이상의 소리파일이 있어야 변환된다. 이보다 짧으면 소리지문이 계산되지 않음.
     - 소리 지문은 플레이 시간에 따라 그 길이가 비례하지만 1~3초 부근의 소리 지문은 이러한 비례 관계가 정확하게 성립하지 않는 것 같다. ( 즉 짧을 수록 부정확함)
     - doorbell_answer.mp3를 돌렸을 때 소리 위치가 40, 104, 132 부근에서 발생하는 것을 확인할 수 있으며  다른 doorbell_test를 돌리면 1을 제외한 2~4에서는 위치는 조금 부정확하더라도 
       크게 세 지점에서 초인종 소리가 발생했다는 것을 확인할 수 있다.
