const trev = require("trev");
module.exports = {
    name: "meme",
    description: "sends pics",
    async execute(client, message, args, Discord){
       
        var subreddits = ["/r/memes","/r/animemes"]
           
        var sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))];

        let subr = await trev.getCustomSubreddit(sub);

        if (subr.media.includes("redgifs.com"))
            return null;

        if (subr.media.includes("imgur.com"))
            return msg.channel.send(subr.media);
                 
        const pics2Embed = new Discord.MessageEmbed()
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setImage(`${subr.media}`)
        message.channel.send(pics2Embed)
    }
}