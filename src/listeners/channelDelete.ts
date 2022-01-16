import { Events, Listener, PieceContext } from '@sapphire/framework'
import { GuildChannel } from 'discord.js'
import { runInThisContext } from 'vm'

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

      this.container.logger.info('DELETED A TICKET', this.container.balancer.tickets)
    }
  }
}
