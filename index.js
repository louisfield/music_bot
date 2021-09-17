require('dotenv').config(); //initialize dotenv
const fs = require('fs');
const { Client, Collection, Intents} = require('discord.js'); //import discord.js
const { execute } = require('./commands/play');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES], })
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let queue = {}
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async msg => {
	if (msg.author.bot) return;
    const user = msg.mentions.users.first();
    if(msg.author != client.user) {
      if (user === client.user) {
          msg.reply("Shut up")
      } else if (msg.content.toLowerCase().includes("adam") && user != client.user) {
        console.log(client.user)
        msg.reply("it shut up fuck adam");
      } 
    }
	if(!queue[msg.guild.id]) {
		queue[msg.guild.id] = []
	}
	if(!!msg.content.match(/^[-]/)){
		const prefix = '!'
		let args = {url: msg.content.split(/  */)}
		const command = args.url.shift().toLowerCase();
		if(command === '-play' || command=== '-stop' || command === '-skip') {
			queue[msg.guild.id].push(args.url.join(' '))
		}
		serverQueue = queue[msg.guild.id]
		console.log(serverQueue)
		args['queue'] = serverQueue
		if (command === '-play') {
			if(!serverQueue[1]) {
				client.commands.get('play').execute(msg,args)
			}
		} else if (command ==='-skip') {
			serverQueue.shift()
			args['queue'] = serverQueue
			if(serverQueue[0]) {
				client.commands.get('play').execute(msg,args)
			} else {
				if( client.voice.connections.find(i => i.channel.id === msg.member.voice.channel.id)){
					queue[msg.guild.id] = []
					const connection = await msg.member.voice.channel.join()
					connection.disconnect()
				}
			}
		} else if (command === '-stop'){
			if( client.voice.connections.find(i => i.channel.id === msg.member.voice.channel.id)){
				queue[msg.guild.id] = []
				const connection = await msg.member.voice.channel.join()
				connection.disconnect()
			}
		} else if (command === '-leave') {
			client.commands.get('leave').execute(msg,args)
		}
	}
  })
  

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token