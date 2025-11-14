import { Client, GatewayIntentBits, Events } from 'discord.js'

export class DiscordSocket {
    constructor() {
        this.client = null
    }

    async init() {
        this.#createClient()
        this.#registerEvents()
        await this.#login()
    }

    #createClient() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ],
        })
    }

    #getToken() {
        return process.env.DISCORD_TOKEN
    }

    async #login() {
        try {
            await this.client.login(this.#getToken())
        } catch (err) {
            console.error('Login failed:', err)
            throw err
        }
    }

    #registerEvents() {
        this.client.once(Events.ClientReady, (client) => {
            console.log(`Logged in as: ${client.user.tag}`)
        })
        this.client.on(Events.MessageCreate, async (msg) => {
            if (msg.author.bot) return
            console.log({
                from: msg.author.username,
                userId: msg.author.id,
                channel: msg.channel.id,
                server: msg.guild.id,
            })
        })
    }
}