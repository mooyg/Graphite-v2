import { Client } from './client/client'
import { config } from 'dotenv'

config()

const client = new Client({
  defaultPrefix: '!',
  presence: {
    status: 'dnd',
    activities: [
      {
        name: 'Listening to Commands',
        type: 'PLAYING',
      },
    ],
  },
  intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'],
})

client.init(process.env.BOT_TOKEN)
