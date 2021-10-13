module.exports = {
    name: 'help',
    description: 'Shows the list of commands',
    execute(client, message, args, Discord){
       const helpEmbed = new Discord.MessageEmbed()
       .setTitle ('My Commands~ :heart:')
       .addFields(
            {name: 'Music Commands: Play!', value: 'Use `>play` followed by keywords or a youtube url while in a VC to play music!'},
            {name: 'Music Commands: Stop!', value: 'Use `>clear`or `>c` to have me clear the queue leave the VC!'},
            {name: 'Music Commands: Skip!', value: 'Use `>skip` or `>fs` to play the next song in queue!'},
            {name: 'Fun Commands!', value: 'Use `>memes` to have me show you some poggers memes from my favorite subreddits!'},
       )

       message.channel.send(helpEmbed);
    }
}