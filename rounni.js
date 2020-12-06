const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const token = "토큰";
const {
  prefix
} = require('./json/config2.json');
const queue = new Map();
const ytdl = require('ytdl-core');

const config = require('./json/config.json');
const money = require('./json/money.json');


var supporter = require('./js/supporter.js');
var addAns = require('./js/addAns.js');
var reinforce = require('./js/reinforce.js');
var emoji = require('./js/emoji.js');
var love = require('./json/love.json')
var embed = 0

client.on("ready", () => {
  console.log("주인님! 반갑다!");
    console.log(`Login ${client.user.username}\n----------------------------`)
  const botgame = [ `${client.guilds.size}개의 서버 | ${client.users.size}명의 유저 | ${client.channels.size}개의 채팅 채널과 함께하고 있어요!`, '이 메세지는 10초마다 랜덤으로 바뀌어요! ', '`루연아 도움` 입력']

  setInterval(() => {
    let activity = botgame[Math.floor(Math.random() * botgame.length)]
    client.user.setActivity(activity, { type: "PLAYING" })
  }, 10000)
    //LISTENING : 듣는중
    //PLAYING : 하는중
    //STREAMING : 일반
    //WATCHING : 보는중
});

client.on("message", async message => {
  //msg.reply(msg.author.avatarURL);

  if(message.content.replace(" ", "").startsWith(config.command)){ //리코를 불렀다면
    console.log(`누가 ${client.user.username} 불렀다!`);
    console.log(parseInt('0xffbf00', 16));
    let comment = message.content.slice(message.content.indexOf(config.command) + config.command.length);
    let text = comment.split(' ');
    console.log(text);
    while(text[0] == '' && text.length > 1){  //텍스트 앞에 공백 제거
      text = text.slice(1);
    }
    console.log(text);
    var answers = JSON.parse(fs.readFileSync('./json/answer.json', 'utf8'));
    console.log(answers);
    if(text[0] == '' || text.length == 0){
      var random = 0
      message.channel.send(`?`);
    }else if(text[0] == "서버네임"){
      message.channel.send(`서버이름은 ${message.guild.name}이다!`);
    }else if(text[0] == "테스트"){
      if(config.administrator.includes(message.author.id)){
        message.reply("주인님! 난 여깄다!");
      }else{
        message.reply("나는 네놈 같은 외부인의 것이 아니다!");
      }
    }else if(text[0] == "도움말"){
      if(text.length == 1){
        var info = config.info;
        message.channel.send({ embed: info });
      }else{
        if(config.hasOwnProperty(text[1])){
          var info = config[text[1]];
          message.channel.send({ embed: info });

        }else{
          message.reply(`그런건 없다!`);
        }

      }
    }else if(text[0] == "건의"){
      fs.readFile('./json/apply.json', 'utf8', (err, data) => {
        data = JSON.parse(data);
        data[text.slice(1).join(" ")] = [message.author.name, message.author.id];
        fs.writeFileSync('./json/apply.json', JSON.stringify(data), 'utf8');
        message.reply(`주인님에게 "${text.slice(1).join(" ")}"라고 말해두었다!`);
      });
    }else if(text[0] == "이모티콘"){

      emoji(text, msg, client);
    }else if(text[0] == "추가" || text[0] == "추가해" || text[0] == "추가해줘"){
      var talk = addAns(text, true);
      console.log(talk);
      if(talk){

        message.channel.send(talk);
      }
    }else if(text[0] == "삭제" || text[0] == "삭제해" || text[0] == "삭제해줘"){
      if(config.administrator.includes(msg.author.id) || config.manager.includes(msg.author.id)){
        var talk = addAns(text, false);
        console.log(talk);
        if(talk){

          message.channel.send(talk);
        }
      }else{
        message.reply('나는 아무나 조종하는 것이 아니다!! **(캬오)**');
      }

    }else if(text[0] == "강화"){
      reinforce(text, msg);
    }else{
      for(var i = 0; i < text.length; i++){ //단문 대답
        console.log(text[i]);
        if(answers.hasOwnProperty(text[i])){
          let answer = answers[text[i]];
          let count = supporter.random(0, answer.length-1, true);
          message.channel.send(answer[count]);
        }
      }
    }
  }
  if (message.content === '루연아 업타임') {
    const embed = new Discord.RichEmbed()
    embed.setTitle(`${client.user.username} 업타임`)
    embed.setColor(0x00ffff)
    embed.setDescription(`**${getUptime()}**`)
    embed.setTimestamp()
    embed.setFooter(message.author.tag, message.author.displayAvatarURL)
    message.channel.send(embed)

    function getUptime() {
            const sec = Math.floor((client.uptime / 1000) % 60).toString()
            const min = Math.floor((client.uptime / (1000 * 60)) % 60).toString()
            const hrs = Math.floor((client.uptime / (1000 * 60 * 60)) % 60).toString()
            const days = Math.floor((client.uptime / (1000 * 60 * 60 * 24)) % 60).toString()
        
            if (days === '0' && hrs === '0' && min === '0') return `${sec.padStart(1, '0')}초`
            else if (days === '0' && hrs === '0') return `${min.padStart(1, '0')}분 ${sec.padStart(1, '0')}초`
            else if (days === '0') return `${hrs.padStart(1, '0')}시간 ${min.padStart(1, '0')}분 ${sec.padStart(1, '0')}초`
            else return `${days.padStart(1, '0')}일 ${hrs.padStart(1, '0')}시간 ${min.padStart(1, '0')}분 ${sec.padStart(1, '0')}초`
        }
  }
  if (message.content === '루연아 돈 줘') {
     if (!money[message.author.id]) {
        money[message.author.id] = {
          money: 0
        };
      }

      let moneyAmt = Math.floor(Math.random() * 100) + 1;
      let baseAmt = moneyAmt;

      if (moneyAmt === baseAmt) {
        money[message.author.id] = {
          money: money[message.author.id].money + moneyAmt
        };

        fs.writeFile("./money.json", JSON.stringify(money), err => {
          if (err) console.log(err);
        });
        console.log(money);

        let umoney = money[message.author.id].money;

        const embed = new Discord.RichEmbed()
        embed.setTitle("돈 지급 완료!")
        embed.setFooter(message.author.username, message.author.displayAvatarURL)
        embed.setTimestamp()
        embed.setColor(0xffff00)
        embed.setThumbnail(message.author.displayAvatarURL)
        embed.addField("지급된 돈(원)", `${moneyAmt}`)
        embed.addField("보유 금액(원)", `${umoney}`);
        message.channel.send(embed);
      }
  }
  if (message.content === '루연아 내 돈') {
    if (!money[message.author.id]) {
          money[message.author.id] = {
            money: 0
          };
        }

        let umoney = money[message.author.id].money;

        const embed = new Discord.RichEmbed()
        embed.setTitle(`${message.author.username}님의 돈`)
        embed.setFooter(message.author.username, message.author.displayAvatarURL)
        embed.setThumbnail(message.author.displayAvatarURL)
        embed.setTimestamp()
        embed.setColor(0xffff00)
        embed.addField("현재 돈(원)", `${umoney}`);
        message.channel.send(embed);
  }
  if (message.content === '루연아 서버 정보') {
    if (message.guild.explicitContentFilter === 0) {
        f = "미디어 콘탠츠를 스캔하지 않음";
      } else if (message.guild.explicitContentFilter === 1) {
        f = "역할 없는 멤버의 미디어 콘텐츠를 스캔함";
      } else if (message.guild.explicitContentFilter === 2) {
        f = "모든 멤버의 미디어 콘텐츠를 스캔함";
      }
      console.log(f);
      if (message.guild.verificationLevel === 0) {
        verifylv = "없음";
      } else if (message.guild.verificationLevel === 1) {
        verifylv = "낮음(Discord 이메일 인증 필요)";
      } else if (message.guild.verificationLevel === 2) {
        verifylv = "보통(Discord 이메일 인증 + 가입 5분 경과 필요)";
      } else if (message.guild.verificationLevel === 3) {
        verifylv =
          "높음(Discord 이메일 인증 + 가입 5분 경과 + 서버 참가 10분 경과 필요)";
      } else if (message.guild.verificationLevel === 4) {
        verifylv =
          "매우 높음(DIscord 이메일, 휴대폰 인증 + 가입 5분 경과 + 서버 참가 10분 경과 필요)";
      }
      console.log(verifylv);
      if (message.guild.afkChannel === null) {
        afk = "잠수 채널 없음";
        afktime = 0;
      } else {
        afk = message.guild.afkChannel;
        afktime = message.guild.afkTimeout;
      }
      const embed = new Discord.RichEmbed()
        embed.setTitle("서버 정보")
        embed.setColor(0x00ff00)
        embed.setThumbnail(message.guild.iconURL)
        embed.setDescription(message.guild.name + " 서버의 정보")
        embed.addField("서버 이름", message.guild.name)
        embed.addField("서버 id", message.guild.id, true)
        embed.addField("서버 생성일", message.guild.createdAt, true)
        embed.addField("서버 주인", message.guild.owner.user.username, true)
        embed.addField("서버 위치", message.guild.region, true)
        embed.addField("서버 인원 수(명)", message.guild.memberCount, true)
        embed.addField("서버 보안 수준", verifylv, true)
        embed.addField(
          "서버 관리에 2단계 인증 필요 여부",
          message.guild.mfaLevel,
          true
        )
        embed.addField("서버 잠수 시간(초)", afktime, true)
        embed.addField("서버 잠수채널", afk, true)
        embed.addField("서버 메세지 필터 옵션", f, true)
        embed.setFooter(message.author.tag, message.author.avatarURL)
        embed.setTimestamp();
      message.channel.send(embed);
  }
  if (message.content === '루연아 올인') {
    if (!money[message.author.id]) {
        message.channel.send("먼저 돈을 받아주세요");
      } else {
        message.channel.send("확률은 절반! 2배가 되거나 잔고가 0원이 됩니다.");
        if (Math.floor(Math.random() * 2) + 1 === 1) {
          message.channel.send(
            "올인 성공!\n현재 돈: " + money[message.author.id].money * 2 + "원"
          );
          money[message.author.id] = {
            money: money[message.author.id].money * 2
          };
          fs.writeFile("./money.json", JSON.stringify(money), err => {
            if (err) console.log(err);
          });
        } else {
          message.channel.send("올인 실패...\n현재 돈: 0원");
          money[message.author.id] = {
            money: 0
          };
          fs.writeFile("./money.json", JSON.stringify(money), err => {
            if (err) console.log(err);
          });
        }
      }
  }
  if (message.content === '루연아 화면공유') {
      if (message.member.voiceChannel) {
            const embed = new Discord.RichEmbed()
                .setAuthor("화면공유 링크 발급!")
                .setColor(0x7CC8FF)
                .addField(`https://discordapp.com/channels/${message.guild.id}/${message.member.voiceChannel.id}`, new Date().toLocaleString())
                .setFooter(`${message.author.username}님이 발급요청`, message.author.displayAvatarURL); //디스코드 기본 프사의 경우는 표시되지 않으므로, displayAvatarURL을 사용하시는 걸 권장합니다.
            message.channel.send(embed);
         }else message.reply("음성채팅방(보이스 채널)입장후. 다시 `루연아 화면공유`을 입력해주세요!");
  }
  if (message.content === '루연아 호감도') {
    if (!love[message.author.id]) {
        love[message.author.id] = {
          love: 0
        };
      }

      let loveAmt = 15
      let baseAmt = loveAmt;

      if (loveAmt === baseAmt) {
        love[message.author.id] = {
          love: love[message.author.id].love = loveAmt
        };

        fs.writeFile("./love.json", JSON.stringify(love), err => {
          if (err) console.log(err);
        });
        console.log(love);

        let love2 = love[message.author.id].love;
        message.channel.send(`루연이는 ${message.author.username}님을 ${love2}만큼 좋아해요!`)
  }}
if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else {
    message.channel.send('You need to enter a valid command!')
  }
});

client.on("guildMemberAdd", (member) => {
  if (member.guild.id === '677448514053341184') {
     member.guild.channels.find(c => c.id === "677454552525701131").send( `${member}님 안녕하세요!`);
}
});
client.on("guildMemberRemove", member => {
  if (member.guild.id === '677448514053341184') {
  member.guild.channels.find(c => c.id === "677454552525701131").send( `${member}님 안녕히가세요ㅠㅠ`);
}
});

async function execute(message, serverQueue) {
  const args = message.content.split(' ');

  const voiceChannel = message.member.voiceChannel;
  if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
    return message.channel.send('I need the permissions to join and speak in your voice channel!');
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    console.log(serverQueue.songs);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }

}

function skip(message, serverQueue) {
  if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
  if (!serverQueue) return message.channel.send('There is no song that I could skip!');
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
    .on('end', () => {
      console.log('Music ended!');
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on('error', error => {
      console.error(error);
    });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

client.login(token);