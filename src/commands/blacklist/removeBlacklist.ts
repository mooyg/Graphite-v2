import { ApplicationCommandRegistry, Command, RegisterBehavior } from '@sapphire/framework'
import { CommandInteraction, GuildManager, GuildMember } from 'discord.js'

export class RemoveBlacklist extends Command {
  constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'removeBlacklist',
      description: 'Remove Blacklist of a user',
      requiredUserPermissions: ['MANAGE_NICKNAMES'],
    })
  }
  public async registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            type: 'USER',
            name: 'user',
            description: 'The User you want to remove blacklist from',
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
    const user = interaction.options.get('user')?.member as GuildMember

    const userDetails = await this.container.prisma.blacklistedUser.findFirst({
      where: {
        discordId: user.user.id,
      },
    })
    if (!userDetails)
      return await interaction.editReply(`No user found for <@${user.user.id}> in database`)

    const res = await this.container.yunite.unblockUser({
      discordId: userDetails?.discordId,
      epicId: userDetails?.epicId,
      guildId: interaction.guild?.id!,
    })

    if (res.statusCode === 200) {
      await this.container.prisma.blacklistedUser.delete({
        where: {
          id: userDetails.id,
        },
      })
      const role = await interaction.guild?.roles.fetch('678193711947186208')
      if (!role) return interaction.editReply('No role found')

      user.roles.remove(role)

      return await interaction.editReply(
        `Succesfully removed blacklist for the user ${userDetails.epicId}`
      )
    } else {
      await this.container.prisma.blacklistedUser.delete({
        where: {
          id: userDetails.id,
        },
      })
      return await interaction.editReply("Some error occured OR user isn't blocked")
    }
  }
}
