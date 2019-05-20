const express = require('express');
const rq = require('request-promise');
const app = express();
const Slack = require('slack-node');
const port = 3001;


app.get('/', function(req, res){
    
// 슬랙 링크
  const webhookUri = "https://hooks.slack.com/services/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";
  const slack = new Slack();
  slack.setWebhook(webhookUri);

  const options = {
      method: 'GET',
      uri: 'https://m.search.naver.com/p/csearch/dcontent/external_api/json_todayunse_v2.naver?_callback=window.__jindo2_callback._fortune_my_0&gender=f&birth=20021210&solarCal=solar&time=',
      headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
      }
  };

  rq(options)
    .then(function(body){
      
      let body2 = body.replace('window.__jindo2_callback._fortune_my_0(','').replace(');','').replace(/\s([A-z]+)\s?:/g,'"$1":').replace('\n','');      
            
      const jsonData = JSON.parse(body2);
      
      res.send(jsonData.result.day.content[0].desc);

      const title = jsonData.result.day.content[0].keyword.replace(/<([^>]+)>/g, "");
      let viewTable = `       
           *${title}*
       `;
        
      let idx = 0;
      for (let content in jsonData.result.day.content) {
        if(idx==4) continue;
        viewTable += `
        
    *${jsonData.result.day.content[idx].name}*
    >${jsonData.result.day.content[idx].desc}
        
        `;
        idx++;
      }

      slack.webhook({
        channel: "2019_도제학생방",      //전송될 슬랙 채널
        username: "카렌의 운세",  // 슬랙에 표시될 이름
        text: viewTable
      }, function(err, response){
          console.log(response);
      });
     
    });
});


app.listen(port, function(){
  console.log('오늘의 운세 출력 중');
})
