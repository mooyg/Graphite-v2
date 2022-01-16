import { Events, Listener, PieceContext } from '@sapphire/framework'
import { GuildChannel, TextChannel } from 'discord.js'

export class ChannelDeleteListener extends Listener {
  public constructor(context: PieceContext) {
    super(context, { event: Events.ChannelDelete })
  }
  async run(channel: GuildChannel): Promise<void> {
    if (
      (await this.container.prisma.listOfTicketCategories.findMany({})).some(
        (ticketCategory) => ticketCategory.categoryId === channel.parentId
      )
    ) {
      this.container.balancer.deleteTicket({
        categoryId: channel.parentId!,
        ticketId: channel.id,
      })

      const adminLogs = this.container.client.channels.cache.get(
        '673537413121048597'
      ) as TextChannel
      adminLogs.send(
        `Ticket <#${channel.id}> (${channel.id}) was deleted from <#${channel.parent}>`
      )
      this.container.logger.info('DELETED A TICKET', this.container.balancer.tickets)
    }
  }
}
