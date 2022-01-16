import { Events, Listener, PieceContext } from '@sapphire/framework'
import { GuildChannel, TextChannel } from 'discord.js'
import { CATEGORY_ID } from '../constants'
export class ChannelCreateListener extends Listener<typeof Events.ChannelCreate> {
  public constructor(context: PieceContext) {
    super(context, { event: Events.ChannelCreate })
  }
  async run(channel: GuildChannel): Promise<void> {
    if (channel.parentId !== CATEGORY_ID) return
    const lowestTicketCategory = this.container.balancer.lowestTicketCategory()
    const adminLogs = this.container.client.channels.cache.get('673537413121048597') as TextChannel
    this.container.balancer.setTicket({
      categoryId: lowestTicketCategory[0],
      ticketId: channel.id,
    })

    adminLogs.send(
      `Ticket <#${channel.id}> (${channel.id}) was assigned to <#${lowestTicketCategory[0]}>`
    )
    this.container.logger.info(this.container.balancer.tickets)
    channel.setParent(lowestTicketCategory[0])
  }
}
