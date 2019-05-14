const express = require('express');
const rq = require('request-promise');
const app = express();
const port = 3000;
const Slack = require('slack-node');
 
const webhookUri = "https://hooks.slack.com/services/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";
 
const slack = new Slack();
slack.setWebhook(webhookUri);

app.get('/', function(req,res){

    let options = {
        method: 'GET',
        uri: 'https://m.search.naver.com/p/csearch/dcontent/external_api/json_todayunse_v2.naver?_callback=window.__jindo2_callback._fortune_my_0&gender=f&birth=20021210&solarCal=solar&time=',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36'
        },
        form: ''
        };

    rq(options)
        .then(function(body){


                // options = {
                //     method: 'post',
                //     uri: 'https://hooks.slack.com/services/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',
                //     body: {
                //         text: 'result'
                //     },
                //     json: true
                // };

            const retData = body.replace('window.__jindo2_callback._fortune_my_0(','').replace(');','').replace(/\s([A-z]+)\s?:/g,'"$1":').replace('\n','');
            const jsonData =  JSON.parse(retData);

            res.send(jsonData.result.day.content);
            console.log('--------------------------------------');
            console.log(jsonData.result.day.content[0].keyword);
            console.log();
            console.log(jsonData.result.day.content[0].desc);
            console.log('--------------------------------------');


            slack.webhook({
                  channel: "#2019_도제학생방", // 전송될 슬랙 채널
                  username: "카렌", //슬랙에 표시될 이름
                  text: '>>>' + jsonData.result.day.content[0].desc
                }, function(err, response) {
                  console.log(response);
                });
              
            return rq(options);
        })
});
app.listen(port, function(){
    console.log('네이버 오늘의 운세');
})