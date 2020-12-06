const fs = require('fs');
const config = require('../json/config.json');

var add = (text, isAdd) => {
  var returnText;
  text = reset(text);
  if(isAdd){
    if(text.length >= 3){
      if(text.length > 8){
        returnText = `으갸아악! 너무 많다!!`;
      }else{
        var data = fs.readFileSync('./json/answer.json', 'utf8');
        var obj = JSON.parse(data);
        if(obj.hasOwnProperty(text[1])){
          obj[text[1]] = obj[text[1]].concat(text.slice(2));
        }else{
          obj[text[1]] = text.slice(2);
        }

        console.log("이거 보셈\n" + JSON.stringify(obj));
        fs.writeFileSync('./json/answer.json', JSON.stringify(obj), 'utf8');
        var content = '';
        for(var i =0; i < obj[text[1]].length; i++){
          content += `\`${obj[text[1]][i]}\`, `;
        }

        returnText = `이제부터 \`${text[1]}\`(이)라고 말하면 ${content.slice(0,-2)}${(text.length == 3) ? "(이)라고" : "중에 하나 골라서"} 대답하겠다!`;

      }

    }else if(text.length == 2){
      returnText = `어떤 말로 반응해야 할지 써주라오....`;
    }else{
      returnText = `뭘 추가할지 알려주라!`;
    }
  }else{

      if(text.length >= 3){
        var talk = text.slice(2);
        data = JSON.parse(fs.readFilSync('./json/answer.json', 'utf8'));
        var content = '';
        if(data.hasOwnProperty(text[1])){
          if(data[text[1]].sort() == talk.sort()){
            delete data[text[1]];
            fs.writeFileSync('./json/answer.json', JSON.stringify(data), 'utf8');
            returnText = `단어 \`${text[1]}\`(을)를 삭제했다!`;
          }else{
            for(var i in talk){
              if(data[text[1]].indexOf(talk[i]) != -1){
                data[text[1]].splice(data[text[1]].indexOf(talk[i]), 1);
                content += `\`${text[1]}\`, `;
              }
            }
            fs.writeFileSync('./json/answer.json', JSON.stringify(data), 'utf8');
            returnText = `단어 ${content.slice(0, -2)}(을)를 삭제했다!`;
          }
        }else{
          returnText = `그런 단어는 없다!`;
        }
      }else if(text.length == 2){
        data = JSON.parse(fs.readFileSync('./json/answer.json', 'utf8'));
        if(data.hasOwnProperty(text[1])){
          delete data[text[1]];
          fs.writeFileSync('./json/answer.json', JSON.stringify(data), 'utf8');
          returnText = `단어 \`${text[1]}\`(을)를 삭제했다!`;
        }else{
          returnText = `그런 단어는 없다!`;
        }
      }else{
        returnText = `뭘 삭제할지 알려주라오!`;
      }

  }
  return returnText;
}

function reset(text){
  var array =[];
  for(var i = 0; i < text.length; i++){
    if(text[i] != ""){
      if(text[i].startsWith('\"')){
        var isReal = false;
        for(var a = 0; a < text.slice(i).length; a++){
          if(text.slice(i)[a].endsWith('\"')){
            var txt = text.slice(i).slice(0, a+1).join(" ").slice(1, -1);
            if(txt.endsWith("\\")){
              txt.slice(0,-1);
            }
            console.log("이거이거 "+txt);
            array.push(txt);
            i += a;
            isReal = true;
            break;
          }
        }
        if(!isReal){
          array.push(text[i]);
        }
      }else{
        array.push(text[i]);
      }
    }
  }
  return array;
}

module.exports = add;
