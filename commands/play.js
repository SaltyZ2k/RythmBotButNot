const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

// Global Queue
const queue = new Map();

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop', 'fs', 's'],
    cooldown: 0,
    description: 'Advanced Music Handler',
    async execute(message, args, cmd, client, Discord){
        
        // VC Check
        const voice_channel = message.member.voice.channel;
        if(!voice_channel) return message.channel.send('Baka! You have to be in a VC to execute this command!');

        // Permissions Check
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send(`Baka! You don't have the correct permissions to execute this command!`);
        if (!permissions.has('SPEAK')) return message.channel.send(`Baka! You don't have the correct permissions to execute this command!`);
        
        // Server Queue Constant
        const server_queue = queue.get(message.guild.id);

        // Play Command
        if(cmd === 'play'){

            // Second Argument Command 
            if (!args.length) return message.channel.send(`Baka! You didn't put a second argument!`);
            let song = {};
            
            // URL Validator & URL Song Object
            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
            // If Not URL, Use Keywords to find video
            } else {
                const video_finder = async (query) =>{
                    const video_result = await ytSearch(query);
                    return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                }
                  // Keyword Checker & Keyword Song Object
                const video = await video_finder(args.join(' '));
                if (video){
                    song = { title: video.title, url: video.url }
                 // Error Message
                } else {
                    message.channel.send('ERROR: Could not find video!');
                }
            }

        // Server Queue Checker/Establisher and Server Queue Constructer
        if(!server_queue){
          
            const queue_constructor = {
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs: []
            }
        
            // Server Key Set & Constructer`
            queue.set(message.guild.id, queue_constructor);
            queue_constructor.songs.push(song);

            // Join Voice Channel & Play Audio
            try {
                const connection = await voice_channel.join();
                queue_constructor.connection = connection;
                video_player(message.guild, queue_constructor.songs[0]);
            } catch (err) {
                queue.delete(message.guild.id);
                message.channel.send('ERROR: Failed Connection');
                throw err;
            }
        } else{
            server_queue.songs.push(song);
            return message.channel.send(`:heart: **${song.title}** has been added to the queue~!`);
            }

        }

        else if(cmd === 'skip') skip_song(message, server_queue);
        else if(cmd === 'stop') stop_song(message, server_queue);
        else if(cmd === 'fs') skip_song(message, server_queue);
        else if(cmd === 's') stop_song(message, server_queue);

    }
}

// Audio Player
const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    // Leave Voice Channel if Queue is Empty
    if(!song) {
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }

    // YT-dl Info
    const stream = ytdl(song.url, { filter: 'audioonly' });
    song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
    .on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });
    await song_queue.text_channel.send(`:heart: Now Playing **${song.title}**`)
}

// Skip Song Defining
const skip_song = (message, server_queue) => {
    if(!message.member.voice.channel) return message.channel.send('Baka! You have to be in a VC to execute this command!');
    if(!server_queue){
        return message.channel.send('ERROR: No songs in Server Queue');
    }
    server_queue.connection.dispatcher.end();
}

// Stop Song Defining
const stop_song = (message, server_queue) => {
    if(!message.member.voice.channel) return message.channel.send('Baka! You have to be in a VC to execute this command!');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
    message.channel.send('I cleared the queue for you~!')
}