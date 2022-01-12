import { Listener } from '@sapphire/framework'
import { info } from 'console'
import { Client } from 'discord.js'

export class Ready extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      once: true,
      event: 'ready',
    })
  }
  async run(client: Client) {
    this.container.logger.info(`Logged in as ${client.user!.username}`)
    const guild = this.container.client.guilds.cache.get('565910084354310154')
    const role = guild?.roles.cache.get('678193711947186208')

    if (!role) return

    setInterval(async () => {
      const users = await this.container.prisma.blacklistedUser.findMany({})
      if (users.length === 0) return this.container.logger.info(`No users in the database`)

      for (let i = 0; i < users.length; i++) {
        if (Date.now() > users[i].endDate) {
          const user = guild?.members.cache.get(users[i].discordId)
          if (!user) {
            return await this.container.prisma.blacklistedUser.delete({
              where: {
                id: users[i].id,
              },
            })
          }
          setTimeout(async () => {
            const { statusCode } = await this.container.yunite.unblockUser({
              discordId: user.user.id,
              epicId: users[i].epicId,
              guildId: guild?.id!,
            })
            if (statusCode === 200) {
              user.roles.remove(role)
              await this.container.prisma.blacklistedUser.delete({
                where: {
                  id: users[i].id,
                },
              })
            } else {
              await this.container.prisma.blacklistedUser.delete({
                where: {
                  id: users[i].id,
                },
              })
              this.container.logger.warn("Some Error occured or user isn't blocked")
            }
          }, 2000)
        } else {
          break
        }
      }
    }, 10000)
  }
}
