
const ytdl = require("ytdl-core");
const ytSearch = require('yt-search')
const reg = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
module.exports = {
		name: 'play',
		description: 'Play youtube video',
	async execute(message,args) {
        const voiceChannel = message.member.voice.channel;
        const connection = await voiceChannel.join()
        const video =  await ytdl(args.join(' '), {filter: 'audioonly'})
        await connection.play(video, {seek: 0, volume: 1})
            
        console.log(video)
	},
};
