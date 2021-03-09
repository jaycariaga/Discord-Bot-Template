const Discord = require("discord.js");
const config = require("./config.json");
var fs = require('fs');

const client = new Discord.Client();
//this updates the current variables with entries from individual discord entries
var noun = fs.readFileSync('./phrases/noun.txt', 'utf8').split("\r\n");
var verb = fs.readFileSync('./phrases/verb.txt', 'utf8').split("\r\n");
var exclamatory = fs.readFileSync('./phrases/exclamatory.txt', 'utf8').split("\r\n");
var endphrase = fs.readFileSync('./phrases/endphrase.txt', 'utf8').split("\r\n");
let pickphrase = fs.readFileSync('./phrases/shizisay.txt', 'utf8').split("\r\n");
var chanID = []
//console.log(noun);


function randomNum(max){
  max = Math.floor(max);
  return Math.floor(Math.random() * max); //The maximum is exclusive and the minimum is inclusive
}

function getChannel(){
  const files = fs.readdirSync('./phrases')
  for (var file of files){
    if(!file.includes('.txt')){
      chanID.push(file)
    }
    continue;
  }
/*  for(var id of chanID){
    console.log(id)
    let channel = client.channels.cache.get(id);
    channel.send('Pong');
  }*/
}




//trying out methods to create server custom phrases
function customcheck(serverid){
  var server = serverid
  let path = './phrases/' + server.toString() + '/'
  //let path = './phrases/'
  //console.log(path)
  try{
    if(fs.existsSync(path)){
      console.log(serverid + "exists")
      return true;
    }
    else{
      fs.mkdirSync(path)
      fs.writeFile(path + 'noun.txt', '', function (err) {
        if (err) console.error(err);
      });
      fs.writeFile(path + 'verb.txt', '', function (err) {
        if (err) console.error(err);
      });
      fs.writeFile(path + 'exclamatory.txt', '', function (err) {
        if (err) console.error(err);
      });
      fs.writeFile(path + 'endphrase.txt', '', function (err) {
        if (err) console.error(err);
      });
      console.log('Saved!');
    }
  }
  catch(e){
    console.error(e)
    return false;
  }
  console.log("failure occured here")
  return false;
}

function phraserand(){
  //let pickphrase = fs.readFileSync('./phrases/shizisay.txt', 'utf8').split("\r\n");
  let randphrase = pickphrase[randomNum(pickphrase.length)];
  return randphrase;
}

//main random function that reads serverid files
function combine(serverid, args){
//remember args as "default"
//console.log(args)
  if(customcheck(serverid) && args == "distinct"){ //if server has config load these up
    let currnoun = fs.readFileSync('./phrases/' + serverid + '/noun.txt', 'utf8').split("\r\n");
    let currverb = fs.readFileSync('./phrases/' + serverid + '/verb.txt', 'utf8').split("\r\n");
    let currexclamatory = fs.readFileSync('./phrases/' + serverid + '/exclamatory.txt', 'utf8').split("\r\n");
    let currendphrase = fs.readFileSync('./phrases/' + serverid + '/endphrase.txt', 'utf8').split("\r\n");
    let newnoun = currnoun[randomNum(currnoun.length)];
    let exclamation = currexclamatory[randomNum(currexclamatory.length)];
    let newverb = currverb[randomNum(currverb.length)];
    let lastphrase = currendphrase[randomNum(currendphrase.length)];
    return [exclamation, newnoun, newverb, lastphrase].join(' ');
  }
  else
  {
	//console.log("DAFUQ");
    let newnoun = noun[randomNum(noun.length)];
    let exclamation = exclamatory[randomNum(exclamatory.length)];
    let newverb = verb[randomNum(verb.length)];
    let lastphrase = endphrase[randomNum(endphrase.length)];
    //return exclamation.concat(' ', [newnoun, newverb, lastphrase]);
    return [exclamation, newnoun, newverb, lastphrase].join(' ');
  }

}

//template for refreshing defaults
function refreshPhrases(){
  noun = fs.readFileSync('./phrases/noun.txt', 'utf8').split("\r\n");
  verb = fs.readFileSync('./phrases/verb.txt', 'utf8').split("\r\n");
  exclamatory = fs.readFileSync('./phrases/exclamatory.txt', 'utf8').split("\r\n");
  endphrase = fs.readFileSync('./phrases/endphrase.txt', 'utf8').split("\r\n");
}

//for checking if the item can be added in to the text file
function compareSpeech(partSpeech, oldphraseInput, serverid){
  customcheck(serverid);
  var phraseInput = oldphraseInput.toLowerCase();
  if(partSpeech=="noun"){
    var currnoun = fs.readFileSync('./phrases/' + serverid + '/noun.txt', 'utf8').split("\r\n");
    var newarr = currnoun.map(v=>v.toLowerCase());
    if(newarr.includes(phraseInput)){
      return true;
    }
  }
  else if(partSpeech == "exclamatory"){
    var currexclamatory = fs.readFileSync('./phrases/' + serverid + '/exclamatory.txt', 'utf8').split("\r\n");
    var newarr = currexclamatory.map(v=>v.toLowerCase());
    if(newarr.includes(phraseInput)){
      return true;
    }
  }
  else if(partSpeech == "verb"){
    var currverb = fs.readFileSync('./phrases/' + serverid + '/verb.txt', 'utf8').split("\r\n");
    var newarr = currverb.map(v=>v.toLowerCase());
    if(newarr.includes(phraseInput)){
      return true;
    }
    //return newarr.includes(phraseInput);
  }
  else if(partSpeech == "endphrase"){
    var currendphrase = fs.readFileSync('./phrases/' + serverid + '/endphrase.txt', 'utf8').split("\r\n");
    var newarr = currendphrase.map(v=>v.toLowerCase());
    if(newarr.includes(phraseInput)){
      return true;
    }
    //return newarr.includes(phraseInput);
  }
  else
    return false;
  
  fs.appendFile('./phrases/' + serverid + '/' + partSpeech + '.txt', oldphraseInput + '\r\n', function(err){
    if(err)
      console.log("entry failed")
    else
      console.log("new entry in: " + partSpeech + ": " + phraseInput);
  });
  return false;
  
}

//a timer implementation meant for reminding users to use my bot
//threshold is every hour before sending a message
//resultantcheck records every half hour of inactivity
var threshTime = 1000*10*60
var start = Date.now()
console.log('starting timer now...')
function resetTime(){
  start = Date.now();
}

function checkTime(){
  end = Date.now()
  if (end-start >= threshTime){
    console.log("time to remind to keep activity going")
    client.emit("message", "!jason remindme")
    return true
  }
  console.log('still waiting')
  return false
}

var resultantcheck = setInterval(checkTime, 1000*60*30)


//below will contain the API's for the client to respond to specific messages
const prefix = "!jason ";


client.on("ready", () => {
	console.log(`${client.user.tag} has logged in!`);
  getChannel();
});

client.on('error', error => {
    console.error('The WebSocket encountered an error:', error);
});

client.on("message", function(message) {
  resetTime()
  //console.log(chanID)
  //instantiating emoji variables
  if (message == "!jason remindme"){
        return;
  }
  if (message.author.bot) return;
  if (message.content === '🥜'){
      message.reply("SHAME SHAME SHAME SHAME SHAME\nSHAME SHAME SHAME SHAME SHAME\nSHAME SHAME SHAME SHAME SHAME", {tts:true});
  }
 /* const ayy = message.guild.emojis.cache.get("773177060238688297");
  if (ayy){
  message.reply("SHAME SHAME SHAME SHAME SHAME\nSHAME SHAME SHAME SHAME SHAME\nSHAME SHAME SHAME SHAME SHAME", {tts:true});
    }*/
  if (!message.content.startsWith(prefix)) return;

  //customcheck(message.guild.id);

  /*let server = message.guild.id
  console.log(server)*/
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  switch (command){

    case "notes":
      var output = fs.readFileSync("./Updates.txt", "utf8");
      message.reply(output);
      break;

  	case "ping":
  		const timeTaken = Date.now() - message.createdTimestamp;
    	message.reply(`Pong! This message had a latency of ${timeTaken} ms.`);
    	break;

    case "deez":
      message.react('🥜')
    	message.channel.send('NUTZZZ', {tts: true});
    	break;

    case "commands":
      message.react('🥜')
    	message.reply('\nCommands are: \n\t[ \n\tnotes - talk about new updates/patches, \n\tprobability - 0-100 seeded number,\n\tsummon - get a purely cohesive sentence from the creator\'s brain,\n\ttalk - must join voice chat and type correct soundbyte,\n\taddphrase - for adding new jason-esque sayings in the database \n\trps - rock, paper, or scissors,\n\tshame..., \n\tbraddar..., \n\tcoinflip,\n\tping - finds latency of server,\n\tdeez - deez what,\n\trandom - PRAY FOR A GOOD SENTENCE (add "tts" argument for speaking bot  e.g. !jason random tts , and to use server distinct phrases use "!jason random distinct"), \n\tcommands - literally what you just entered in. shows all available commands \n\t]');
    	break;
    case "summon":
      var output = phraserand(); 
      if(args.includes("tts")){
        message.channel.send(output, {tts:true});
      }
      else
        message.reply(output);
      break;

    case "random":
      var output = combine(message.guild.id, args[0]);
      if(args.includes("tts")){
        message.channel.send(output, {tts:true});
      }
      else
        message.reply(output);
      break;

    case "braddar":
      message.reply('BRADDARRRRRRRRRRRRRRRRRRRRRRRRRRRR');
      break;

    case "coinflip":
      var coin = randomNum(2); //2 values
      if(coin)
        message.reply("Heads");
      else
        message.reply("Tails");
      break;

    case "shame":
      message.reply('shame\nshame\nshame\nshame\nshame\nshame\nshame\nshame\nshame\nshame\nshame\nshame\nshame\nshame\nshame\nshame\n');
      break;

    case "probability":
      message.reply(randomNum(101));
      break;

    case "hello":
      //message.reply("hello", {tts : true})
      message.channel.send("hello", {tts : true})
      break;

  //currently attempting to add words or phrases to the global vars
    case "addphrase":
      var checkme = args[0];
      if(checkme == "noun" || checkme == "exclamatory" || checkme == "verb" || checkme == "endphrase"){
        message.channel.send("You Have 10 seconds to write the word/phrase to add!:\n");
        const collector = new Discord.MessageCollector(message.channel, m => m.author.id === message.author.id, { max:1, time: 10000  });
        collector.on('collect', message => {
          var phrinput = message.content
          //if match to an element cancel push, else push
          if(compareSpeech(checkme, phrinput, message.guild.id)){
            message.reply("match found");
          }
          else{
            message.reply("no matches u good. added ur entry into the db!");
            refreshPhrases(message.guild.id); //reloads phrases
          }

        });
        //end of pushing
      }
      else{
        message.reply("arguments must be either: noun, exclamatory, verb, or endphrase ...\nE.g. \'!jason addphrase noun\'")
      }

      break;

    case "rps":
      var choice = ['rock', 'paper', 'scissors'];
      // rock = 0;
      // paper = 1;
      // scissors = 2;
      var cpu = randomNum(3);
      message.reply("I chose: " + choice[cpu])

      switch(args[0]){
        case 'rock':
          if(cpu == 0)
            message.reply("Tie! Try Again!");
          else if(cpu == 1)
            message.reply("You lose! LOSERRR");
          else
            message.reply("You Win! I will hate you forever");
          break;

        case 'paper':
          if(cpu == 1)
            message.reply("Tie! Try Again!");
          else if(cpu == 2)
            message.reply("You lose! LOSERRR");
          else
            message.reply("You Win! Next time i guess...");
          break;

        case 'scissors':
          if(cpu == 2)
            message.reply("Tie! Try Again!");
          else if(cpu == 0)
            message.reply("You lose! LOSERRR");
          else
            message.reply("You Win! I curse your family now");
          break;

        default:
          message.reply('please answer using: \'rock\', \'paper\', or \'scissors\'');
      }
      //console.log(args);
      break;


    case "talk":
    //arg[0] used as the input for soundboard
      var VC = message.member.voice.channel;
      if (!VC)
          message.reply("Please enter a voice channel to use this properly...")
      else{
        //console.log("Jason-Bot has entered the Voice Chat");
        VC.join().then(connection => {
          var filename = './audioBytes/OOFmp.mp3';
          switch(args[0])
          {
            case "oof":
              //commented code for only one case: works for others still but returns init error
              filename = './audioBytes/OOFmp.mp3'
              break;
            case "beyonce":
              filename = './audioBytes/allnight.mp3'
              break;
            case "monkey":
              filename = './audioBytes/monkeytime.mp3'
            break;
            case "mj":
              filename = './audioBytes/MJ_hell.mp3'
            break;
            case "franku":
              filename = './audioBytes/filthyfrank.mp3'
            break;
            case "scatman":
              filename = './audioBytes/scatman.mp3'
            break;
            case "loveu":
              filename = './audioBytes/loveu.mp3'
            break;
            case "usher":
              filename = './audioBytes/usher.mp3'
            break;
            case "birdup":
              filename = './audioBytes/birdup.mp3'
            break;
            case "fruitloop":
              filename = './audioBytes/fruitloop.mp3'
            break;
            case "pilot":
              filename = './audioBytes/pilot.mp3'
            break;
            case "ohyea1":
              filename = './audioBytes/ohyea1.mp3'
            break;
            case "ohyea2":
              filename = './audioBytes/ohyea2.mp3'
            break;
            case "n":
              filename = './audioBytes/n.mp3'
            break;
            case "windows":
              filename = './audioBytes/windows.mp3'
            break;
            case "chiefkeefondem":
              filename = './audioBytes/chiefkeef.mp3'
            break;
            default:
              message.reply('Quick reminder that the available arguments are of now: [oof, ohyea1, ohyea2, windows, pilot, beyonce, monkey, n, mj, fruitloop, franku, scatman, loveu, birdup, usher]...but i\'ll just play oof for you anyways')
              break;
          }
          const dispatcher = connection.play(filename);
          //problem::cant tell when it ends;
          dispatcher.on("finish", () => {
            connection.disconnect()
            //client.leaveVoiceChannel(message.member.voiceState.channelID);
          });
          console.log("audio played out");
        })
        .catch(err => console.log(err));
      }

      break;

    default:
    	message.reply("not a command. please refer to !jason commands for more info");
    	break;
  }

  /*if(command === "ping") {
  	const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken} ms.`);
  }*/


});

//instantiates login of client
client.login(config.BOT_TOKEN);
