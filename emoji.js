const config = require('../json/config.json');
const fs = require('fs');

function getEmoticonIdByEmoticon(emoticon, emoticons){
  var returnText = "";
  if(emoticon.startsWith("<:") && emoticon.endsWith(">")){
    var name = emoticon.slice(emoticon.lastIndexOf(":")+1, -1);
    var emo = emoticons.get(name);
    if(emo){
      returnText = name;
    }else{
      console.log(`"${name}" is none`);
      returnText = "none";
    }
  }else{
    console.log(`"${name}" is not emoticon`);
    returnText = "none";
  }
  return returnText;
}

var func = (text, msg, client) => {
  const emoticons = client.emojis;
  if(text.length > 1){
    if(text[1] == "추가"){
      if(text.length > 2){
        if(text.length%2 == 0){
          if(text.length <= 10){
            var emoticonsCount = {};
            for(var i = 0; i < text.slice(2).length; i += 2){
              var emoticonName = text.slice(2)[i];
              var emoticon = getEmoticonIdByEmoticon(text.slice(2)[i+1], emoticons);
              if(emoticon != "none"){
                emoticonsCount[emoticonName] = {"id": emoticon, "name": emoticonName};
              }
            }
            fs.readFile('./json/emoticon.json', 'utf8', (err, data) => {
              if(err) throw err;
              data = JSON.parse(data);
              var content = ``;
              var already = ``;
              for(var i in emoticonsCount){
                console.log(`이모티콘 json : ${JSON.stringify(emoticonsCount[i])}`);
                if(data.hasOwnProperty(i)){
                  already += `\`${emoticonsCount[i].name}\`, `;
                }else{
                  data[i] = emoticonsCount[i];
                  content += `\`${emoticonsCount[i].name}\` ${emoticons.get(emoticonsCount[i].id)}, `;
                }
              }
              save(data);
              if(content == '' && already != ''){
                msg.channel.send(`${already.slice(0, -2)}(은)는 이미 포함되어있다..;;`);
              }else{
                msg.channel.send(`${content.slice(0, -2)}(을)를 추가했다! ${(already == ``) ? `` : `\`\`\`(참고 : ${already.slice(0, -2)}(은)는 이미 포함되어있다..;;)\`\`\``}`);
              }
            });
          }else{
            msg.reply(`으갸아아악!! 너무 많다!!`);
          }
        }else{
          msg.reply(`이름 하나에! 이모티콘 하나다!!`);
        }
      }else{

        msg.reply(`뭘 추가할지 알려주라!`);
      }
    }else if(text[1] == "삭제"){
      if(config.administrator.includes(msg.author.id) || config.manager.includes(msg.author.id)){
        if(text.length > 2){
          fs.readFile('./json/emoticon.json', 'utf8', (err, data) => {
            if(err) throw err;
            data = JSON.parse(data);
            var content = ``;
            for(var i = 0; i < text.slice(2).length; i++){
              if(data.hasOwnProperty(text.slice(2)[i])){
                delete data[text.slice(2)[i]];
                content += `\`${text.slice(2)[i]}\`, `;
              }
            }
            save(data);
            msg.channel.send(`${content.slice(0, -2)}(을)를 삭제했다!`);
          });

        }else{
          msg.reply(`뭘 삭제할지 알려주라!`);
        }
      }else{
        msg.reply(`삭제할 권한 따윈 없다!`);
      }
    }else{
      fs.readFile('./json/emoticon.json', 'utf8', (err, data) => {
        if(err) throw err;
        console.log(data);
        data = JSON.parse(data);
        console.log(data);
        var content = ``;
        for(var i = 0; i < text.slice(1).length; i++){
          if(data.hasOwnProperty(text.slice(1)[i])){
            content += `${emoticons.get(data[text.slice(1)[i]].id)}`;
          }
        }
        if(content != ``){
          msg.delete();
          msg.channel.send(content);
        }else{
          msg.reply(`그런거 없다냥!`);
        }

      });
    }
  }else{
    msg.reply(`어떤 이모티콘인지 알려주라!`);
  }
}

function save(data){
  fs.writeFileSync('./json/emoticon.json', JSON.stringify(data), 'utf8');
}

module.exports = func;
