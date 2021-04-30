const Discord = require('discord.js');
const config = require('../config.json');
const prefix = config.prefix;
const embedColor = config.embedColor;
const errorColor = config.errorColor;

const {Client} = require('exaroton');
const exarotonClient = new Client(config.exarotonAPIkey);

module.exports = {
    name: 'stop',
    description: 'Stop a Minecraft server.',
    usage: '`'+prefix+'stop {server name}`',
    permission: '`ADMINISTRATOR`',
    execute(msg, args){
        if(args[0] == undefined){
            const notSeverMentioned = new Discord.MessageEmbed()
                .setTitle('Error!')
                .setDescription('Your message does not include an exaroton server.')
                .setColor(errorColor)
            console.log(msg.content + ' | User: ' + msg.author.username+'#'+msg.author.discriminator)
            msg.channel.send(notSeverMentioned)
            return
        } else{
            async function APIstop() {
                let name = args[0];
                let serverLists = await exarotonClient.getServers();
                let server = serverLists.find(server => server.name === name);
                try {
                    await server.executeCommand('say [exaroton API] This server will be stopped in a few seconds.');
                    await server.stop();
                    const serverStoppingEmbed = new Discord.MessageEmbed()
                        .setDescription(`Stopping server **${server.name}**`)
                        .setColor(embedColor)
                        .setFooter(msg.author.username+'#'+msg.author.discriminator, msg.member.user.displayAvatarURL())
                    msg.channel.send(serverStoppingEmbed)
                    console.log(msg.content + ' | User: ' + msg.author.username+'#'+msg.author.discriminator)
                } catch (e) {
                    console.log(msg.content + ' | User: ' + msg.author.username+'#'+msg.author.discriminator)
                    console.error('An error occurred while using "stop" command: ' + e.message);
                    if(e.message == 'Server is not online') {
                        const serverNotOnlineEmbed = new Discord.MessageEmbed()
                            .setTitle('Error!')
                            .setDescription('This is only possible when your server is online.')
                            .setColor(errorColor)
                        msg.channel.send(serverNotOnlineEmbed)
                    }
                    else if(e.message == "Cannot read property 'executeCommand' of undefined") {
                        const serverNotFoundEmbed = new Discord.MessageEmbed()
                            .setTitle('Error!')
                            .setDescription(`Server "${args[0]}" not found.`)
                            .setColor(errorColor)
                        msg.channel.send(serverNotFoundEmbed)
                    } else{
                        const errorEmbed = new Discord.MessageEmbed()
                            .setTitle('Error!')
                            .setDescription('An error occurred while running that command: `' + e.message + '`')
                            .setColor(errorColor)
                        msg.channel.send(errorEmbed)
                    }
                    
                }
            }
            APIstop();
        }
    }
}