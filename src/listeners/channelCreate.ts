import { Events, Listener, PieceContext } from '@sapphire/framework'
import { GuildChannel } from 'discord.js'
import { CATEGORY_ID } from '../constants'
export class ChannelCreateListener extends Listener<typeof Events.ChannelCreate> {
  public constructor(context: PieceContext) {
    super(context, { event: Events.ChannelCreate })
  }
  async run(channel: GuildChannel): Promise<void> {
    if (channel.parentId !== CATEGORY_ID) return
    const lowestTicketCategory = this.container.balancer.lowestTicketCategory()

    this.container.balancer.setTicket({
      categoryId: lowestTicketCategory[0],
      ticketId: channel.id,
    })

    this.container.logger.info(this.container.balancer.tickets)
    channel.setParent(lowestTicketCategory[0])
  }
}
