var reinforceDifficulty = 40;
var delay = 20;
var lvUpMax = 13;
var reinforceList = {};
var isDestroyUse = true;
var destroyPersent = 10;
var isReinforceUse = {};

var destroyMsg = [`%2확률로 %1파괴됬다! 크하핫!`, `...아쉽게도 %2확률로 파괴됬다...`, `%2확률로 %1가 파괴됬다...`, `이젠 말안해도 아는 것이다! %1 (참고: %2)`];

const fs = require('fs');
const config = require('../json/config.json');

function reinforceForm(name, msg){
  return {
    "name": name,
    "lv": 1,
    "userId": msg.author.id,
    "username": msg.author.username,
    "server": msg.guild.id,
    "serverName": msg.guild.name
  };
}

function showRank(msg, data, isWorld){
  var lank = [];
  for(var i in data){
    var count = 0;
    for(count = 0; count< lank.length; count++){
      if(lank[count].lv <= data[i].lv){
        break;
      }
    }

    lank.splice(count, 0, data[i]);
  }
  if(isWorld){
    var content = ``;
    for(var i in lank){
      var text = `#${i+1} [${lank[i].name}] Lv.${lank[i].lv} (${lank[i].username})  -"${lank[i].serverName}"\n`;
      content += text;
    }
    content = "\`**세계랭킹**\`\n\`\`\`css\n"+ content +"\n\`\`\`";
    msg.channel.send(content);
  }else{
    var content = ``;
    for(var i in lank){
      var text = `#${i+1} [${lank[i].name}] Lv.${lank[i].lv} (${lank[i].username})\n`;
      content += text;
    }
    content = "\`**랭킹**\`\n\`\`\`css\n"+ content +"\n\`\`\`";
    msg.channel.send(content);
  }
}

function save(data){
  fs.writeFileSync('./json/wapons.json', JSON.stringify(data), 'utf8');
}

var func = (text, msg) => {
  if(text.length > 1){
    var waponName = text.slice(1).join(" ");
    if(waponName.indexOf("&") > -1){
      //무기 이름에 &는 안됨
    }else{
      fs.readFile('./json/wapons.json', 'utf8', (err, data) => {
        if(err){
          console.log(err);
          msg.channel.send(`${config.errSenderr}\n\`${err.toString()}\``);
        }
        data = JSON.parse(data);
        var d = {};
        for(var i in data){
          if(data[i].server == msg.guild.id){
            d[i] = data[i];
          }
        }
        if(text[1] == "랭킹"){
          showRank(msg, d, false);
        }else if(text[1] == "세계랭킹"){
          showRank(msg, data, true);
        }else if(text[1] == "삭제"){
          var lastName = text.slice(2).join(" ");
          if(data[`${msg.author.id}&${lastName}`]){ //만약 시간리셋리스트에 id가 포함되어있지 않다면
            delete data[`${msg.author.id}&${lastName}`];
            save(data);
            msg.reply(`${lastName}(을)를 쓰레기통에 넣었단 것이다!`);
          }else{
            msg.reply('그런 거는 없다!');
          }
        }else{

          if(!isReinforceUse[msg.author.id]){ //만약 시간리셋리스트에 id가 포함되어있지 않다면
            isReinforceUse[msg.author.id] = 0;
          }
          if(isReinforceUse[msg.author.id] === 0){ //시간 제한이 0이라면
            if(!data[`${msg.author.id}&${waponName}`]){  //만약 물건이 강화리스트에 포함되어있지 않다면
              data[`${msg.author.id}&${waponName}`] =  reinforceForm(waponName, msg);
              console.log(data[`${msg.author.id}&${waponName}`]);
            }
            //console.log(waponName + data[`${msg.author.id}&${waponName}`]["lv"]);
            var isReinforced = upPercentage(percent(data[`${msg.author.id}&${waponName}`].lv, true)); //강화 여부
            if(isReinforced){ //강화 됨
              var lvUp = lvUpCount();
              var lastLv = data[`${msg.author.id}&${waponName}`].lv;
              data[`${msg.author.id}&${waponName}`].lv += lvUp;
              var perc = percent(lastLv, true);
              var script = `${waponName}(이)가 ${Math.round(perc*10)/10}의 확률로 Lv.${lastLv}에서 Lv.${data[`${msg.author.id}&${waponName}`].lv}(으)로 올라갔다!!`;
              msg.channel.send(script);
            }else{ //강화 안됨
              if(upPercentage(percent(data[`${msg.author.id}&${waponName}`].lv, false)) && isDestroyUse){ //파괴됨
                var script = destroyMsg[Math.floor(Math.random()*destroyMsg.length)].replace("%1", waponName).replace("%2", percent(data[`${msg.author.id}&${waponName}`].lv, false));
                delete data[`${msg.author.id}&${waponName}`];
                msg.channel.send(script);
              }else{ //파괴안됨
                var lvDown = lvUpCount(); //레벨 다운
                var lastLv = data[`${msg.author.id}&${waponName}`].lv; //기존 레벨
                data[`${msg.author.id}&${waponName}`].lv -= lvDown; //레벨 다운
                if(lastLv-lvDown < 1){
                  data[`${msg.author.id}&${waponName}`].lv = 1;
                }
                var perc = 100 - percent(lastLv, true);
                var script = `${waponName}(이)가 ${Math.round(perc*10)/10}의 확률로 Lv.${lastLv}에서 Lv.${data[`${msg.author.id}&${waponName}`].lv}(으)로 내려갔다!`;
                msg.channel.send(script);
              }
            }
            lessDelay(msg.author.id); //시간 제약
          }else{
            msg.reply(`**${isReinforceUse[msg.author.id]}초**이따가 강화해줄꺼다!`);
          }
          save(data);
        }
      });
    }
  }else{
    msg.reply(`어떤걸 강화할지 알려주세요ㅠㅠ`);
  }
}

module.exports = func;

// function reinforceForm(msg, name){
//   var reinforceSlot = {
//     "name": name,
//     "owner": msg.author.id,
//     "username": msg.author.username,
//     "lv": 1
//   };
//   return reinforceSlot;
// }
//
//
// function showList(msg, isWorld){
//   var lank = [];
//   var content = '';
//   for(var i in reinforceList){
//     var count;
//     for(count in lank){
//       console.log(reinforceList[i].lv+' '+lank[count].lv);
//       if(reinforceList[i].lv >= lank[count].lv){
//         break;
//       }
//     }
//     lank.splice(count, 0, reinforceList[i]);
//   }
//   for(var b in lank){
//     content += `#${b*1+1} [${lank[b].name}] Lv.${lank[b].lv} (${lank[b].username})\n`;
//   }
//   msg.channel.send("```css\n"+ content + "\n```");
// }
//
// var func = function(text, msg){
//
//       if(text.length == 1){
//
//       }else{
//         var name = text.slice(1).join(" ");
//         if(name == "랭킹"){
//           showList(msg, false);
//         }else if(name == "세계랭킹"){
//
//         }else{

//         }
//       }
//
// }
//
function lessDelay(id){
  isReinforceUse[id] = delay;
  var a = setInterval(function(){
    isReinforceUse[id]--;
    if(isReinforceUse[id]==0){
      clearInterval(a);
    }
  }, 1000);
}

function isDestroy(lv){
 var percentage = Math.pow(lv, 2)* 1/(10* destroyPersent);
 return upPercentage(percentage);
}

function percent(lv, isReinforce){
  var percentage;
  if(isReinforce){
    percentage = 100 * reinforceDifficulty / (lv + reinforceDifficulty - 1);
  }else{
    percentage = Math.pow(lv, 2)* 1/(10* destroyPersent);
  }
  return percentage;
}

function lvUpCount(){
  return Math.floor(Math.random()* (lvUpMax-1)) + 1;
}

function upPercentage(percent){
  return (Math.random()*100 <=percent);
}

function reinforce(json){
  var lv = json.lv;
  var percentage = 100 * reinforceDifficulty / (lv + reinforceDifficulty - 1);
  return upPercentage(percentage);
}

// module.exports = func;
