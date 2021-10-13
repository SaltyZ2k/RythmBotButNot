module.exports = {
    name: 'handholding',
    description: 'holds your hand',
    async execute(client, message, args){
        if (message.author.id == 581970765507723289) {
            message.reply(`I will hold your hand anytime! :heart: :heart:`);
        } else {
            message.reply(`I'm sorry, I will only do that with my husband!`); ;
}

    }
}