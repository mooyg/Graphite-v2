import { Events, Listener, PieceContext } from '@sapphire/framework'
import { GuildChannel } from 'discord.js'
export class ChannelCreateListener extends Listener<typeof Events.ChannelCreate> {
  public constructor(context: PieceContext) {
    super(context, { event: Events.ChannelCreate })
  }
  async run(channel: GuildChannel): Promise<void> {
    if (channel.parentId !== '696958267007696949') return
    const listOfCategories = await this.container.prisma.listOfTicketCategories.findMany({})
    this.container.logger.info(listOfCategories)
  }
}
