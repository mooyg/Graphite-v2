import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework'
import { CommandInteraction } from 'discord.js'

export class RegisterTicketCategory extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'registerticketcategory',
      description: 'Register a ticket category to the database for automatic sorting',
      requiredUserPermissions: ['BAN_MEMBERS'],
    })
  }

  public async registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: 'rtc',
        description: this.description,
        options: [
          {
            name: 'categoryid',
            type: 'STRING',
            description: 'Category ID',
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

    const categoryId = interaction.options.get('categoryId')
    console.log(categoryId)
    if (!categoryId?.value) return interaction.editReply("You didn't specify an id")

    if (
      interaction.guild?.channels.cache.get(categoryId.value as string)?.type === 'GUILD_CATEGORY'
    ) {
      try {
        await this.container.prisma.listOfTicketCategories.create({
          data: {
            categoryId: categoryId.value as string,
          },
        })
        await interaction.editReply(`Added category <#${categoryId}> to the database`)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
