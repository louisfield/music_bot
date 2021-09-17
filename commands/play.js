
const ytdl = require("ytdl-core");
const ytSearch = require('yt-search')
const reg = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
let queue = {}
module.exports = {
		name: 'play',
		description: 'Play youtube video',
	async execute(message,args) {


        const voiceChannel = message.member.voice.channel;
        const connection = await voiceChannel.join()
        
        console.log(args.queue)
        const video =  await ytdl(args.queue[0], {filter: 'audioonly'})
        message.reply("PLAYING")
        const v = connection
        .play(video, {seek: 0, volume: 1})
        .on("finish", () => {
            args.queue.shift()
            if(args.queue[0]) {
                this.execute(message,args)
            } else {
                connection.disconnect()
                message.member.voice.channel.leave();
            }
        })
        
     
    
	},
};
