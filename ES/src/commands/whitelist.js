const Discord = require('discord.js');
const config = require("../config.json");
const prefix = config.prefix;

const {Client} = require('exaroton');
const exarotonClient = new Client(config.exarotonAPIkey);

module.exports = {
    name: 'whitelist',
    description: 'Añade a un jugador a la lista blanca del servidor.',
    usage: '`'+prefix+'whitelist {nombre|ID|dirección del servidor} {jugador de Minecraft}`',
    permission: '`Ninguno`',
    execute(bot, msg, args){
        async function APIwhitelist(){
            try{
                if(!msg.member.permissions.has("ADMINISTRATOR")){
                    const MissingPermissionsEmbed = new Discord.MessageEmbed()
                        .setTitle('Error!')
                        .setDescription('Necesitas el permiso `Administrador` para ejecutar ese comando.')
                        .setColor(config.errorColor)
                    await msg.channel.send({embeds:[MissingPermissionsEmbed]})
                    return
                }
                if(args.length === 0){
                    const notSeverMentioned = new Discord.MessageEmbed()
                        .setTitle('Error!')
                        .setDescription('Tu mensaje no incluye el parámetro **{servidor}**. \n*Usa ' + '`'+prefix+'help whitelist`' + ' para más información.*')
                        .setColor(config.errorColor)
                    await msg.channel.send({embeds:[notSeverMentioned]})
                    return
                }
                if(args.length === 1){
                    const missingPlayerEmbed = new Discord.MessageEmbed()
                        .setTitle('Error!')
                        .setDescription('Tu mensaje no incluye el parámetro **{jugador de Minecraft}**. \n*Usa ' + '`'+prefix+'help whitelist`' + ' para más información.*')
                        .setColor(config.errorColor)
                    await msg.channel.send({embeds:[missingPlayerEmbed]})
                    return
                }
                let name = args[0];
                let serverLists = await exarotonClient.getServers();
                let server = serverLists.find(server => server.name === name || server.id === name || server.address === name);
                let username  = args[1]
                let list = server.getPlayerList("whitelist")
                await list.addEntry(username)
                const playerWhitelistAddedEmbed = new Discord.MessageEmbed()
                    .setDescription(`El jugador **${username}** ahora está en la lista blanca del servidor **${server.name}**.`)
                    .setColor(config.embedColor) 
                await msg.channel.send({embeds:[playerWhitelistAddedEmbed]})
            } catch(e){
                console.log(msg.content + ' | Usuario: ' + msg.author.tag)
                console.error(`Error al usar el comando "whitelist": ${e.message}`)
                if(e.message === "Cannot read properties of undefined (reading 'getPlayerList')"){
                    const serverNotFoundEmbed = new Discord.MessageEmbed()
                        .setTitle('Error!')
                        .setDescription(`El servidor "${args[0]}" no ha sido encontrado.`)
                        .setColor(config.errorColor)
                    await msg.channel.send({embeds:[serverNotFoundEmbed]})
                    return
                } else{
                    const errorEmbed = new Discord.MessageEmbed()
                        .setTitle('Error!')
                        .setDescription('Ocurrió un error al ejecutar ese comando: `' + e.message + '`')
                        .setColor(config.errorColor)
                    await msg.channel.send({embeds:[errorEmbed]})
                    return
                }
            }
        }
        APIwhitelist();
    }
}