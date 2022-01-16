import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework'
import { CommandInteraction } from 'discord.js'

export class RegisterTicketCategory extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'unregisterticketcategory',
      description: 'Remove a ticket category from the database for automatic sorting',
      requiredUserPermissions: ['BAN_MEMBERS'],
    })
  }

  public async registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: 'urtc',
        description: this.description,
        options: [
          {
            name: 'categoryid',
            type: 'STRING',
            description: 'Category ID',
            required: true,
          },
        ],
      },
      {
        guildIds: ['565910084354310154'],
        behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
      }
    )
  }
  public async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.inGuild()) return
    await interaction.deferReply()
    const categoryId = interaction.options.get('categoryid')
    if (!categoryId?.value) return interaction.editReply("You didn't specify an id")

    if (
      interaction.guild?.channels.cache.get(categoryId.value as string)?.type === 'GUILD_CATEGORY'
    ) {
      try {
        await this.container.prisma.listOfTicketCategories.delete({
          where: {
            categoryId: categoryId.value as string,
          },
        })
        await interaction.editReply(`Removed category <#${categoryId.value}> from the database`)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
